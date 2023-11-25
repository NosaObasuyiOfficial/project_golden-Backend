"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_all_client_transactions_controller_1 = require("../controllers/get_all_client_transactions.controller");
const router = express_1.default.Router();
router.get('/all-transactions', get_all_client_transactions_controller_1.all_client_transactions);
exports.default = router;
