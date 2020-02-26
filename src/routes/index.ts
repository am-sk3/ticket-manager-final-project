import { Response, Request, Router, NextFunction } from 'express';
import AuthController from '../controllers/auth.controller';
import TicketsController from '../controllers/tickets.controller';
import UsersController from '../controllers/users.controller';
import CompanyController from '../controllers/company.controller';
import PermissionsController from '../controllers/permissions.controller';

const router = Router();

//  AUTH
router.post('/api/auth/login', AuthController.login);
router.post('/api/auth/register', AuthController.register);
// router.delete('/api/auth/logout', AuthController.logout);

//  TICKETS
router.get(
    '/api/tickets',
    PermissionsController.verifyAdminUsers,
    TicketsController.getAll
);
router.get('/api/tickets/:id', TicketsController.getTicket);
router.put('/api/tickets/:id/update', TicketsController.updateTicket);
router.post('/api/tickets/create', TicketsController.create);
router.put(
    '/api/tickets/:id/remove',
    PermissionsController.verifyAdminUsers,
    TicketsController.removeTicket
);
router.post('/api/tickets/:id/comment', TicketsController.createComment);
router.put(
    '/api/tickets/:id/closed',
    PermissionsController.verifyAdminUsers,
    TicketsController.closeTicket
);
//  router.get('/api/tickets/closed', TicketsController.getAllClosed);

//  USERS
router.get('/api/users', UsersController.getAll);
router.get(
    '/api/users/:id',
    PermissionsController.verifyAdminUsers,

    UsersController.getById
);
router.post(
    '/api/users',
    PermissionsController.verifyAdminUsers,
    UsersController.createUser
);
router.post('/api/users/changePassword', UsersController.changePassword);
router.put('/api/users/:id', UsersController.editUser);
router.delete(
    '/api/users/:id',
    PermissionsController.verifyAdminUsers,
    UsersController.removeUser
);

//  COMPANIES
router.get(
    '/api/companies',
    PermissionsController.verifyAdminUsers,
    CompanyController.getAll
);
router.get(
    '/api/companies/:id',
    PermissionsController.verifyAdminUsers,
    CompanyController.getById
);
router.post(
    '/api/companies',
    PermissionsController.verifyAdminUsers,
    CompanyController.create
);
router.put(
    '/api/companies/:id',
    PermissionsController.verifyAdminUsers,
    CompanyController.update
);
router.delete(
    '/api/companies/:id',
    PermissionsController.verifyAdminUsers,
    CompanyController.delete
);
router.post(
    '/api/companies/:id/user',
    PermissionsController.verifyAdminUsers,
    CompanyController.addUser
);
router.delete(
    '/api/companies/:id/user',
    PermissionsController.verifyAdminUsers,
    CompanyController.deleteUser
);

export default router;
