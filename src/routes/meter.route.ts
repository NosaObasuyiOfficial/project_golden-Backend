import express from 'express'
import {  add_meter, get_meter_details } from '../controllers/add_meter.controller'

const router = express.Router()

router.post('/onabill/add-meter', add_meter )

router.get('/onabill/get-all-meter', get_meter_details )

export default router
