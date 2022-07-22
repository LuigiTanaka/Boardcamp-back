import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouter from './routes/categoriesRouter.js';
import customersRouter from './routes/customersRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import rentalsRouter from './routes/rentalsRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoriesRouter);
app.use(customersRouter);
app.use(gamesRouter);
app.use(rentalsRouter);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log("servidou rodando!"));