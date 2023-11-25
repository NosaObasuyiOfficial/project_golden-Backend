"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_customer_info = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const client_wallet_model_1 = __importDefault(require("../db_model/client_wallet.model"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const get_customer_info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            const token_info = token.split(" ")[1];
            const decodedToken = jsonwebtoken_1.default.verify(token_info, APP_SECRET);
            const customer_id = decodedToken.id;
            const getting_customer_data = yield signup_model_1.default.findOne({
                where: {
                    id: customer_id
                }
            });
            if (getting_customer_data === null || getting_customer_data === void 0 ? void 0 : getting_customer_data.dataValues) {
                const client_wallet = yield client_wallet_model_1.default.findOne({
                    where: {
                        phoneNumber: getting_customer_data.dataValues.phoneNumber
                    }
                });
                const client_firstName = getting_customer_data.dataValues.firstName;
                if (Number(client_wallet === null || client_wallet === void 0 ? void 0 : client_wallet.dataValues.wallet_balance) === (client_wallet === null || client_wallet === void 0 ? void 0 : client_wallet.dataValues.wallet_balance) && (client_wallet === null || client_wallet === void 0 ? void 0 : client_wallet.dataValues.wallet_balance) % 1 !== 0) {
                    const client_wallet_balance = client_wallet === null || client_wallet === void 0 ? void 0 : client_wallet.dataValues.wallet_balance;
                }
                const client_wallet_balance = `${client_wallet === null || client_wallet === void 0 ? void 0 : client_wallet.dataValues.wallet_balance}.00`;
                const info = {
                    firstName: client_firstName,
                    wallet_balance: client_wallet_balance
                };
                return res.status(200).json({
                    data: info
                });
            }
            else {
                return res.status(400).json({
                    message: `You are not a registered user.`
                });
            }
        }
        else {
            return res.status(500).json({
                message: `Set Token in the local storage`
            });
        }
    }
    catch (error) {
        console.error("Error getting customer info:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.get_customer_info = get_customer_info;
