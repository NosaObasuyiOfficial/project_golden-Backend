"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deposit_withdrawal_controller_1 = require("../controllers/deposit&withdrawal.controller");
const router = express_1.default.Router();
router.post('/user/deposit', deposit_withdrawal_controller_1.deposit);
router.post('/make-payment', deposit_withdrawal_controller_1.made_deposit);
router.post('/make-withdrawal', deposit_withdrawal_controller_1.withdrawal);
router.post('/complete-withdrawal', deposit_withdrawal_controller_1.made_withdrawal);
exports.default = router;
