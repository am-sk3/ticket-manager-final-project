import { Router } from 'express';
import AuthController from './controllers/auth.controller';
import TicketsController from './controllers/tickets.controller';
import UsersController from './controllers/users.controller';
import CompanyController from './controllers/company.controller';

const router = Router();

//  AUTH
router.post('/api/auth/login', AuthController.login);
router.post('/api/auth/register', AuthController.register);
router.delete('/api/auth/logout', AuthController.logout);

//  TICKETS
router.get('api/tickets', TicketsController.getAll);
router.put('/api/tickets/:id/update', TicketsController.updateTicket);
router.post('/api/tickets/create', TicketsController.createTicket); 
router.get('/api/tickets/:id', TicketsController.getTicket);
router.delete('/api/tickets/:id/remove', TicketsController.removeTicket);
router.post('/api/tickets/:id/comment', TicketsController.createComment); 
//  router.get('/api/tickets/:id/closed', TicketsController.markAsClosed); 
//  router.get('/api/tickets/closed', TicketsController.getAllClosed);

//  USERS
router.get('/api/users', UsersController.getAll);
router.get('/api/users/:id', UsersController.getUser);
router.post('/api/users/:id/create', UsersController.createUser);
router.put('/api/users/:id/edit', UsersController.editUser);
router.delete('/api/users/:id/remove', UsersController.removeUser);

//  COMPANIES
router.get('/api/companies', CompanyController.getAll);
router.get('/api/companies/:id', CompanyController.getOne);
router.post('/api/companies/create', CompanyController.create);
router.put('/api/companies/:id/update', CompanyController.update);
router.delete('/api/companies/:id/delete', CompanyController.delete);
router.post('/api/companies/:id/user', CompanyController.addUser);
router.delete('/api/companies/:id/user', CompanyController.deleteUser);

export default router;