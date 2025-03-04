/**
 * @desc An interface that represents an entry in the file system.
 * @prop path {string} Path to the entry, name is included.
 * @prop name {string} Name of the entry.
 * @prop directory {boolean} Entry is a directory.
 */
export interface entry {
    path: string;
    name: string;
    directory: boolean;
}