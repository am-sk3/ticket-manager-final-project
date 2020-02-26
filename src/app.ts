import express from 'express';
import { join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import TokenMiddleWare from './core/auth/token.middleware';

class App {
    public express: express.Application;

    public constructor() {
        this.express = express();

        this.setupViewEngine();
        this.setupExpress();
        // this.setupLogger();

        this.routes();
        // Setup express
    }

    public static run(port: number): void {
        const app = new App().express;
        app.listen(port, () =>
            console.log(`--> App Started at http://localhost:${port}`)
        );
    }

    private setupViewEngine(): void {
        this.express.set('views', join(__dirname, 'views'));
        this.express.set('view engine', 'ejs');
    }

    private setupExpress(): void {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
    }

    // private setupLogger(): void {
    //     this.express.use(Logger.logRequestsMiddleware);
    // }

    private routes(): void {
        this.express.use(express.static(`${__dirname}/../public`));
        // Middlewares
        this.express.use(TokenMiddleWare.tokenVerify);
        this.express.use(router);
    }
}

export default App;
