import express from 'express'
import { onabill_signup_controller } from '../controllers/admin_section/admin_signup'
import { deposit_processing } from '../controllers/admin_section/deposit_processing'
import { electricity_bills_processing } from '../controllers/admin_section/electricity_bills_processing'
import { withdrawal_processing  } from '../controllers/admin_section/withdrawal_processing'
import { all_transaction_records } from '../controllers/admin_section/get_all_transactions'


const router = express.Router()

router.post('/admin/signup', onabill_signup_controller)
router.post('/admin/deposit_prcessing', deposit_processing)
router.post('/admin/electricity_bills_prcessing', electricity_bills_processing )
router.post('/admin/withdrawal_processing', withdrawal_processing )
router.get('/admin/all_transaction_records', all_transaction_records)

export default router


