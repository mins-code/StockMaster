import { Role } from '@prisma/client';
import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  role?: Role;
}