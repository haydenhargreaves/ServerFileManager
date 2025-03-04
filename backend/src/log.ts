import {NextFunction, Request, Response} from "express";

/**
 * Log a request in a common format. This is designed to be used as middleware.
 * @param req {Request} The request object.
 * @param res {Response} The response object.
 * @param next {NextFunction} Next function
 */
export function LogRequestMiddleware(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${req.method.toUpperCase()}] ${req.url} ${req.ip} `);
    next();
}