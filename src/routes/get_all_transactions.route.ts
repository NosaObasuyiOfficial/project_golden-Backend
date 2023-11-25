import express from 'express'

import { all_client_transactions } from '../controllers/get_all_client_transactions.controller'

const router = express.Router()

router.get('/all-transactions', all_client_transactions )


export default router
