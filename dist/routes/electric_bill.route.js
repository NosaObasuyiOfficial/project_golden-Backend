"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const electric_bill_controller_1 = require("../controllers/electric_bill.controller");
const router = express_1.default.Router();
router.post('/electricity-bill-payment', electric_bill_controller_1.electricity_payment);
exports.default = router;
