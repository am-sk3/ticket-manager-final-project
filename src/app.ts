import bodyParser from "body-parser";
import express from "express";
import router from "./routes";

export class App {

    public static run(port: number): void {
        const app = new App().express;
        app.listen(port, () => console.log(`--> App started on http://localhost:${port}`));
    }

    public express: express.Application;

    public constructor() {
        this.express = express();

        this.setupExpress();
        
        this.routes();
    }

    private setupExpress(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.express.use(express.static(__dirname + "/../public"));
        // this.express.use(TokenMiddleware.tokenVerify);
        this.express.use(router);
    }
}
