import express from 'express'
import { onabill_signup_controller } from '../controllers/signup.controller'

const router = express.Router()

router.post('/onabill_signup', onabill_signup_controller)

export default router





