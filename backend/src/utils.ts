import {Express} from "express";
import bcrypt from "bcrypt";

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
 * Create a hash of string
 * @param s {string} Target string
 * @return {string} Target string hash
 */
export function hashString(s: string): string {
    return bcrypt.hashSync(s, 10);
}

/**
 * Validates a string to a hash
 * @param s {string} Target string
 * @param hash {string} Target hash
 * @return {boolean} Is the string and hash match
 */
export function validateHash(s: string, hash: string): boolean {
    return bcrypt.compareSync(s, hash);
}