import express from 'express'
import { electricity_payment } from '../controllers/electric_bill.controller'

const router = express.Router()

router.post('/electricity-bill-payment', electricity_payment)

export default router
