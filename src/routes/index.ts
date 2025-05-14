import express from 'express';
import { UserRoutes } from '../app/modules/user/user.route';
import { AdminRouter } from '../app/modules/admin/admin.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: "/admin",
    route: AdminRouter
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
