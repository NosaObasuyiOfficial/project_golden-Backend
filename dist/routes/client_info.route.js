"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_info_controller_1 = require("../controllers/client_info.controller");
const router = express_1.default.Router();
router.get('/get-customer-info', client_info_controller_1.get_customer_info);
exports.default = router;
