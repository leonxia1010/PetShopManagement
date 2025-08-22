import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // 开发模式：检查是否为dev token
    if (process.env.NODE_ENV === 'development' && token?.startsWith('dev-')) {
      const devRole = token.split('-')[1]; // dev-manager -> manager
      console.log('Dev mode authentication:', { token, role: devRole });
      
      (req as AuthenticatedRequest).user = {
        id: `dev-${devRole}`,
        email: `${devRole}@test.com`,
        role: devRole,
      };
      
      return next();
    }

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Extract role from app_metadata
    const role = user.app_metadata?.role || 'clerk'; // Default to clerk if no role set

    // Attach user info to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email!,
      role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: authReq.user.role,
      });
    }

    next();
  };
};
