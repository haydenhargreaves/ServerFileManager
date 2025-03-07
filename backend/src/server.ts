import express, {Express, Request, Response, Router} from "express";
import {Healthcheck} from "./healthcheck";
import {printEndpoints, validateHash} from "./utils";
import {LogRequestMiddleware} from "./log";
import * as fs from "node:fs";
import {entry} from "./entry";
import cors from "cors";
import archiver from "archiver";
import {appendDirectoryToArchive, appendFileToArchive} from "./download";
import path from "node:path";
import {verifyToken} from "./authenicate";
import jwt from "jsonwebtoken";
import {config} from "dotenv";

/**
 * App details
 */
const PORT = 5000;
const APP: Express = express();
const ROOT: string = "/home/azpect";

/**
 * Configure the .env file, this is for testing only, should be ignored in production.
 */
try {
    config({path: ".env"});
} catch (error) {
    console.error(`Could not load the .env file. If this is a production environment, this is normal!`);
}

/**
 * Invalid file extensions for the file editor.
 */
const INVALID_EXTS: string[] = ["exe", "dll", "obj", "lib", "bin", "dat", "pdf", "jpg", "jpeg", "png", "gif", "webm", "webp", "bmp", "mp3", "wav", "mp4", "avi", "zip", "rar", "7z", "iso", "dmg", "class", "pyc", "o", "a", "woff", "woff2", "ttf", "otf", "db", "sqlite", "mdb", "accdb", "psd", "ai", "indd", "blend", "fbx", "unitypackage", "pak", "sav", "msi", "doc", "docx", "dot", "dotx", "docm", "dotm", "rtf", "txt", "xls", "xlsx", "xlsm", "xltx", "xltm", "csv", "ppt", "pptx", "pptm", "potx", "potm", "ppsx", "ppsm", "mdb", "accdb", "accde", "accdt", "pst", "ost", "msg", "one", "onetoc2", "pub", "vsd", "vsdx", "vssx", "vstx", "odc", "oft", "pki", "odg"];

/**
 * Configure cors, this should work for both production and development.
 */
const corsOptions: cors.CorsOptions = {
    origin: ["http://localhost:3100", "https://file.gophernest.net"],
    methods: ["GET", "POST"]
};
APP.use(cors(corsOptions));

/**
 * Apply middleware, this must be done before the routes are created.
 */
APP.use(verifyToken);
APP.use(LogRequestMiddleware);
APP.use(express.json());

/**
 * Create routes for modular routing
 */
const v1: Router = express.Router();

/**
 * Return a healthcheck interface loaded with the server's health
 */
v1.get("/healthcheck", (req: Request, res: Response): void => {
    let hc: Healthcheck = {
        health: "Server is in bad health",
        errors: ["The root directory could not be found."],
        directory_found: false,
    };

    res.status(200).json(hc);
});

/**
 * Make a log in attempt.
 */
v1.post("/login", (req: Request, res: Response): void => {
    // Get info from body
    const {username, password} = req.body;

    // Get required info from the environment and validate
    if (process.env["FILE_GOPHERNEST_USER"] === username && validateHash(password, process.env["FILE_GOPHERNEST_PASSWORD"] as string)) {
        // Get the secret from the env
        const jwt_secret: string | undefined = process.env["FILE_GOPHERNEST_JWT_SECRET"];
        if (!jwt_secret) {
            res.status(500).json({code: 500, message: "JSON web tokens are not configured."});
            return;
        }

        // Create the token
        const token: string = jwt.sign({username}, jwt_secret, {expiresIn: "30d"});
        res.status(200).json({code: 200, token});
    } else {
        res.status(404).json({code: 404, message: "Invalid credentials. Please try again!"});
    }
});

/**
 * Get the children of a directory provided in the path query.
 */
v1.get("/children", (req: Request, res: Response): void => {
    // Get the path, if it was not provided, use the root
    const path: string = (req.query.path || ROOT) as string;

    // An array of names which are the children
    const children_paths: string[] = fs.readdirSync(path);

    // Store a list of the children as entries
    const children: entry[] = [];

    for (const child of children_paths) {
        try {
            const isDir: boolean = fs.statSync(path.concat("/", child)).isDirectory();
            children.push({
                name: child,
                path: path.concat("/", child),
                directory: isDir
            });
        } catch (error) {
            console.log(error);
        }
    }
    res.status(200).json(children);
});

/**
 * Down a group of files provided in the body.
 */
v1.post("/download", (req: Request, res: Response): void => {
    // Get the files from the body
    const {filePaths} = req.body;

    // Validate the path array
    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
        res.status(400).send({code: 400, error: 'Invalid file paths provided.'});
        return;
    }

    const archive: archiver.Archiver = archiver('zip', {
        zlib: {level: 9}, // Compression leve
    });

    // Set the file headers
    res.setHeader('Content-Disposition', 'attachment; filename=donwloads.zip');
    res.setHeader('Content-Type', 'application/zip');

    archive.pipe(res);

    // Add each file to the archive
    filePaths.forEach((filePath): void => {
        // This works for files, but for directories, we need to read the files

        try {
            const stats = fs.statSync(filePath);
            if (!stats.isDirectory()) {
                appendFileToArchive(filePath, archive);
            } else {
                // Call this with the name to include the name of the directory
                appendDirectoryToArchive(filePath, path.basename(filePath), archive);
            }
        } catch (err) {
            console.error(`Error adding file to zip: ${err}`);
        }
    });

    // Return errors
    archive.on('error', (err): void => {
        res.status(500).send({error: err.message});
    });

    archive.finalize();
});

/**
 * Retrieve the content of a file provided in the path query.
 */
v1.get("/content", (req: Request, res: Response): void => {
    // Get the path, if it was not provided, return no content
    const tgtPath: string = (req.query.path || "") as string;
    if (!tgtPath) {
        res.status(204);
        return;
    }

    // Ensure the file isn't something we can't edit
    const ext: string = path.extname(tgtPath).slice(1);
    if (INVALID_EXTS.includes(ext)) {
        res.status(400).json({error: `Cannot edit files of type *.${ext}`, code: 400});
        return;
    }

    try {
        // Read the file and return it
        const content = fs.readFileSync(tgtPath, {encoding: "utf-8", flag: "r"})
        res.status(200).json({content, code: 200});
    } catch (err) {
        res.status(500).json({error: `An error occurred on the server. ${err}`, code: 500});
    }
});

/**
 * Update a file's content, path and content should be provided.
 * On success, nothing should be sent back, 204.
 */
v1.post("/update", (req: Request, res: Response): void => {
    // Get path and content from the request
    const {path, content} = req.body;

    try {
        fs.writeFileSync(path, content);
        res.status(204);
    } catch (error) {
        res.status(500).json({code: 500, error})
    }
});
/**
 * Apply the routes to the server
 */
APP.use("/v1", v1);

/**
 * Start the server
 */
APP.listen(PORT, (): void => {
    printEndpoints(APP);
    console.log(`Server listening on :${PORT}`);
});