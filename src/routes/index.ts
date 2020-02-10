import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import TicketsController from '../controllers/tickets.controller';
import UsersController from '../controllers/users.controller';
import CompanyController from '../controllers/company.controller';

const router = Router();

//  AUTH
router.post('/api/auth/login', AuthController.login);
router.post('/api/auth/register', AuthController.register);
// router.delete('/api/auth/logout', AuthController.logout);

//  TICKETS
router.get('/api/tickets', TicketsController.getAll);
router.put('/api/tickets/:id/update', TicketsController.updateTicket);
router.post('/api/tickets/create', TicketsController.create);
router.get('/api/tickets/:id', TicketsController.getTicket);
router.put('/api/tickets/:id/remove', TicketsController.removeTicket);
router.post('/api/tickets/:id/comment', 
TicketsController.createComment);
 router.put('/api/tickets/:id/closed', TicketsController.closeTicket);
//  router.get('/api/tickets/closed', TicketsController.getAllClosed);

//  USERS
router.get('/api/users', UsersController.getAll);
router.get('/api/users/:id', UsersController.getById);
router.post('/api/users', UsersController.createUser);
router.put('/api/users/:id', UsersController.editUser);
router.delete('/api/users/:id', UsersController.removeUser);

//  COMPANIES
router.get('/api/companies', CompanyController.getAll);
router.get('/api/companies/:id', CompanyController.getById);
router.post('/api/companies', CompanyController.create);
router.put('/api/companies/:id', CompanyController.update);
router.delete('/api/companies/:id', CompanyController.delete);
router.post('/api/companies/:id/user', CompanyController.addUser);
router.delete('/api/companies/:id/user', CompanyController.deleteUser);

export default router;
