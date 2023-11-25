import express from 'express'
import { get_customer_info } from '../controllers/client_info.controller'

const router = express.Router()

router.get('/get-customer-info', get_customer_info)

export default router


