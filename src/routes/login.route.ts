import express from 'express'
import { onabill_login_controller } from '../controllers/login.controller'

const router = express.Router()

router.post('/onabill_login', onabill_login_controller)

export default router





