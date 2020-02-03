class CompanyController {
    public getAll(): void {}

    public getOne(): void {}

    public create(): void {}

    public update(): void {}

    public delete(): void {}

    public addUser(): void {}

    public deleteUser(): void {}
}

// router.get('/api/companies', CompanyController.getAll);
// router.get('/api/companies/:id', CompanyController.getOne);
// router.post('/api/companies/create', CompanyController.create);
// router.put('/api/companies/:id/update', CompanyController.update);
// router.delete('/api/companies/:id/delete', CompanyController.delete);
// router.post('/api/companies/:id/user', CompanyController.addUser);
// router.delete('/api/companies/:id/user', CompanyController.deleteUser);
export default new CompanyController();
