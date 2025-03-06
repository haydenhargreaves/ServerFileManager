import {Express} from "express";
import * as crypto from "node:crypto";

/**
 * @desc Print the endpoints loaded into the express application.
 * @param app {Express} Express application
 */
export function printEndpoints(app: Express): void {
    function traverse(stack: any[], basePath = ''): void {
        stack.forEach((layer: any) => {
            if (layer.route) {
                const methods = layer.route.methods;
                if (methods) {
                    Object.keys(methods).forEach((method) => {
                        console.log(`${method.toUpperCase()} ${basePath}${layer.route.path}`);
                    });
                }
            } else if (layer.name === 'router' && layer.handle.stack) {
                const routerBasePath = layer.regexp
                    ? basePath + layer.regexp.source.replace('\\/?(?=\\/|$)', '').replace('\\/', '/')
                    : basePath;
                traverse(layer.handle.stack, routerBasePath);
            }
        });
    }

    traverse(app._router.stack);
}

/**
 * Hash a string.
 * @param s {string} Target string
 * @return {string} Target string hash
 */
export function hashString(s: string): string {
    // Generate a random salt if not provided
    const salt = crypto.randomBytes(16).toString('hex');

    // Parameters for scrypt
    const keylen = 64; // Length of the derived key (hash)
    const cost = 16384; // CPU/memory cost parameter (N)
    const blockSize = 8; // Block size parameter (r)
    const parallelization = 1; // Parallelization parameter (p)

    // Derive the key (hash)
    const derivedKey = crypto.scryptSync(
        s,
        salt,
        keylen,
        {cost, blockSize, parallelization}
    );

    // Store the salt and hash together (e.g., as a colon-separated string)
    return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Validate a string and a hash for a match
 * @param s Target string
 * @param hash Target hash
 * @return {boolean} Valid
 */
export function validateHash(s: string, hash: string): boolean {
    // Split the stored hash into salt and derived key
    const [salt, storedDerivedKeyHex] = hash.split(':');
    const storedDerivedKey = Buffer.from(storedDerivedKeyHex, 'hex');

    // Parameters for scrypt (must match the hashing parameters)
    const keylen = 64;
    const cost = 16384;
    const blockSize = 8;
    const parallelization = 1;

    // Derive the key from the provided password and stored salt
    const derivedKey = crypto.scryptSync(
        s,
        salt,
        keylen,
        {cost, blockSize, parallelization}
    );

    // Compare the derived key with the stored derived key
    return crypto.timingSafeEqual(derivedKey, storedDerivedKey);
}