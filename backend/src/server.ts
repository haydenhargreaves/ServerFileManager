import express, {Express, Request, Response, Router} from "express";
import {Healthcheck} from "./healthcheck";
import {printEndpoints} from "./utils";
import {LogRequestMiddleware} from "./log";
import * as fs from "node:fs";
import {entry} from "./entry";
import cors from "cors";
import archiver from "archiver";
import {appendDirectoryToArchive, appendFileToArchive} from "./download";
import path from "node:path";

/**
 * App details
 */
const PORT = 5000;
const APP: Express = express();
const ROOT: string = "/home/azpect";

/**
 * Configure cors
 * TODO: Update hosts for production
 */
const corsOptions: cors.CorsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET"]
};
APP.use(cors(corsOptions));

/**
 * Apply middleware, this must be done before the routes are created.
 */
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
 * Index route
 */
v1.get("/", (req: Request, res: Response): void => {
    res.send("Hello world!");
});

/**
 * Get the children of a directory provided in the path query.
 */
v1.get("/children", (req: Request, res: Response): void => {
    // Get the path, if it was not provided, use the root
    const path: string = (req.query.path || ROOT) as string;
    // if (!path) {
    //     res.status(400).json({error: "Please provide a path. E.g. /v1/children?path=/path/to/target", code: 400});
    //     return;
    // }

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
 * Down a group of files provided in the body
 */
v1.post("/download", (req: Request, res: Response): void => {
    // Get the files from the body
    const {filePaths} = req.body;

    // Validate the path array
    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
        res.status(400).send({error: 'Invalid file paths provided.'});
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