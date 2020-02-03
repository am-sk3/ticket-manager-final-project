// import express from 'express';
import * as dotenv from 'dotenv';
import App from './app';

// const app = express();
dotenv.config();

const PORT: number = Number(process.env.PORT);

App.run(PORT);
