"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_meter_controller_1 = require("../controllers/add_meter.controller");
const router = express_1.default.Router();
router.post('/onabill/add-meter', add_meter_controller_1.add_meter);
router.get('/onabill/get-all-meter', add_meter_controller_1.get_meter_details);
exports.default = router;
