import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

/**
 * Verify that the request has a token provided. Extra security measure. This is
 * designed to be used middleware.
 * @param req Request object
 * @param res Response object
 * @param next Next function object
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): any {
    // We can't expect someone to have a key before they login!
    if (req.url === "/v1/login") {
        return next();
    }

    // Get the auth headers from the request
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const pieces = authHeader.split(' ');
        if (pieces.length < 2) {
            return res.sendStatus(401);
        }

        // Get token and key
        const token: string = pieces[1];
        const secretKey: string = process.env["FILE_GOPHERNEST_JWT_SECRET"] || "" as string;

        // Ensure JWTs are setup
        if (!secretKey) {
            return res.status(500).json({message: 'JWT secret not configured'});
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            // TODO: Do we need a user attached?
            // (req as any).user = user; // Attach user to request object
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}