import path from "node:path";
import fs from "node:fs";
import archiver from "archiver";

/**
 * Append a file from the path to the archiver. Errors will be bubbled out
 * @param filePath Target path
 * @param archive The archiver
 * @constructor
 */
export function appendFileToArchive(filePath: string, archive: archiver.Archiver): void {
    try {
        const fileName = path.basename(filePath);
        archive.append(fs.createReadStream(filePath), {name: fileName});
    } catch (error) {
        throw new Error(`Error appending file to archive: ${error}`);
    }
}

/**
 * Recursively append directories to
 * @param filePath
 * @param archiveRelPath
 * @param archive
 */
export function appendDirectoryToArchive(filePath: string, archiveRelPath: string = "", archive: archiver.Archiver): void {
    try {
        const files = fs.readdirSync(filePath);
        const relative = path.relative(path.dirname(filePath), filePath);

        // Skip hidden folders, for now this is enabled
        // TODO: Implement a selector for hidden folders
        if (relative.startsWith(".")) {
            return
        }

        files.forEach((file: string): void => {
            const fullPath: string = path.join(filePath, file);
            const relPath: string = path.join(archiveRelPath, file);

            // Might need to skip symbolic links

            // If it's file, append it the normal way, use the relative path as the name
            if (!fs.statSync(fullPath).isDirectory()) {
                archive.append(fs.createReadStream(fullPath), {name: relPath});

                // Otherwise, call self with a new relative path
            } else {
                appendDirectoryToArchive(fullPath, relPath, archive);
            }
        });


    } catch (error) {
        throw new Error(`Error appending directory to archive: ${error}`);
    }
}