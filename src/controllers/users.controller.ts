class UsersController {
    public getAll(): void {}

    public getUser(): void {}

    public createUser(): void {}

    public editUser(): void {}

    public removeUser(): void {}
}

// router.get('/api/users', UsersController.getAll);
// router.get('/api/users/:id', UsersController.getUser);
// router.post('/api/users/:id/create', UsersController.createUser);
// router.put('/api/users/:id/edit', UsersController.editUser);
// router.delete('/api/users/:id/remove', UsersController.removeUser);
export default new UsersController();
