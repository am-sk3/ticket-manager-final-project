// import express from 'express';
import * as dotenv from 'dotenv';
import { Model } from 'objection';
import App from './app';
import queryBuilder from './core/db';

Model.knex(queryBuilder);
// const app = express();
dotenv.config();

const PORT: number = Number(process.env.PORT);

App.run(PORT);
