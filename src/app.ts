import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { db } from './database_connection/db_connect'
import SignupRoute from './routes/signup.route'
import loginRoute from './routes/login.route'
import clientInfoRoute from './routes/client_info.route'
import deposit_and_withdrawalRoute from './routes/deposit&withdrawal.route'
import meterRoute from './routes/meter.route'
import electricBillRoute from './routes/electric_bill.route'
import getAllTransactionsRoute from './routes/get_all_transactions.route'
import adminRoute from './routes/admin_routes.route'
import cors from "cors";


/*--------env setup-----------*/
dotenv.config()
const { PORT } = process.env

const app = express()

/*----------Middlewares-------------*/
app.use(cors())
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:false}))

/*------------Endpoints--------------*/
app.use('/', SignupRoute)
app.use('/', loginRoute)
app.use('/', clientInfoRoute)
app.use('/', deposit_and_withdrawalRoute)
app.use('/', meterRoute)
app.use('/', electricBillRoute)
app.use('/', getAllTransactionsRoute)

app.use('/admin', adminRoute)

/*----Checking Database Connection-------------*/
db.sync()
  .then(() => {
    console.log("Database is connected SUCCESSFULLY");
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

export default app