import express from 'express';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();

app.listen(process.env.PORT, () => console.log('running !'));
