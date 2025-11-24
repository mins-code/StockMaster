import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types.d.js';
/**
 * Middleware to verify the JWT token and attach user data (userId, role) to the request.
 */
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if the authenticated user has one of the required roles.
 */
export declare const authorizeRole: (requiredRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map