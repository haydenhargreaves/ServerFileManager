import {Express} from "express";

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