class TicketsController {
    public getAll(): void {}

    public updateTicket(): void {}

    public createTicket(): void {}

    public getTicket(): void {}

    public removeTicket(): void {}

    public createComment(): void {}
}

//  TICKETS
// router.get('/api/tickets', TicketsController.getAll);
// router.put('/api/tickets/:id/update', TicketsController.updateTicket);
// router.post('/api/tickets/create', TicketsController.createTicket);
// router.get('/api/tickets/:id', TicketsController.getTicket);
// router.delete('/api/tickets/:id/remove', TicketsController.removeTicket);
// router.post('/api/tickets/:id/comment', TicketsController.createComment);
export default new TicketsController();
