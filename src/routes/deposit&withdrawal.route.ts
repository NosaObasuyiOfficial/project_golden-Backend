import express from 'express'
import { deposit, made_deposit, withdrawal, made_withdrawal } from '../controllers/deposit&withdrawal.controller'

const router = express.Router()

router.post('/user/deposit', deposit)

router.post('/make-payment', made_deposit )

router.post('/make-withdrawal', withdrawal )

router.post('/complete-withdrawal', made_withdrawal )

export default router
