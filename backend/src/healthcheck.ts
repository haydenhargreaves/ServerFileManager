/**
 * @desc Interface for creating and returning a healthcheck
 * @prop health {string} The status of the server.
 * @prop errors {string[]} If there are any errors, they're here.
 * @prop directory_found {boolean} Can the server find the root.
 */
export interface Healthcheck {
    health: string;
    errors: string[];
    directory_found: boolean;
}