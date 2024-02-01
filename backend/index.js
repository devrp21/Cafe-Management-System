import express, { urlencoded } from 'express';
import cors from 'cors';
import connection from './connection.js';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';
import billRouter from './routes/bill.js';
import dashboardRouter from './routes/dashboard.js';

// const connection = require('./connection');
const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/bill', billRouter);
app.use('/dashboard', dashboardRouter);

export default app;