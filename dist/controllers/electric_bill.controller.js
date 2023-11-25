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
exports.electricity_payment = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const input_validation_1 = require("../utilities/input_validation");
const electric_bill_model_1 = __importDefault(require("../db_model/electric_bill.model"));
const client_wallet_model_1 = __importDefault(require("../db_model/client_wallet.model"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const electricity_payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*-------------------------Validating Input -------------------------------*/
        let valid_input_bill_amount = input_validation_1.bill_amount.validate(req.body.bill_amount);
        if (valid_input_bill_amount.error) {
            const error_message = valid_input_bill_amount.error.details[0].message;
            return res
                .status(400)
                .json({ message: `bill_amount - ${error_message}` });
        }
        const valid_bill_amount = valid_input_bill_amount.value;
        let valid_input_meter_details = input_validation_1.meter_details.validate(req.body.meter_details);
        if (valid_input_meter_details.error) {
            const error_message = valid_input_meter_details.error.details[0].message;
            return res
                .status(400)
                .json({ message: `meter_details - ${error_message}` });
        }
        const valid_meter_details = valid_input_meter_details.value;
        /*-------------------------Validating Input -------------------------------*/
        const token = req.headers.authorization;
        if (token) {
            const token_info = token.split(" ")[1];
            const decodedToken = jsonwebtoken_1.default.verify(token_info, APP_SECRET);
            const customer_id = decodedToken.id;
            const getting_customer_data = yield signup_model_1.default.findOne({
                where: {
                    id: customer_id,
                },
            });
            if (getting_customer_data === null || getting_customer_data === void 0 ? void 0 : getting_customer_data.dataValues) {
                const checking_user_account = yield client_wallet_model_1.default.findOne({
                    where: {
                        phoneNumber: getting_customer_data.dataValues.phoneNumber,
                    },
                });
                const user_account_balance = checking_user_account === null || checking_user_account === void 0 ? void 0 : checking_user_account.dataValues.wallet_balance;
                if (user_account_balance >= +valid_bill_amount) {
                    /*----------------------- Setting Date -------------------------*/
                    const timestamp = new Date().getTime();
                    const date = new Date(timestamp);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const transfer_date = date.getDate();
                    const hours = date.getHours().toString().padStart(2, "0");
                    const minutes = date.getMinutes().toString().padStart(2, "0");
                    const seconds = date.getSeconds().toString().padStart(2, "0");
                    const transaction_time = `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`;
                    /*----------------------- Setting Date -------------------------*/
                    const bill_record = yield electric_bill_model_1.default.create({
                        id: (0, uuid_1.v4)(),
                        user_id: getting_customer_data.dataValues.id,
                        date: transaction_time,
                        phoneNumber: getting_customer_data.dataValues.phoneNumber,
                        tnx_id: (0, uuid_1.v4)(),
                        type: "Electricity Bill",
                        amount: valid_bill_amount,
                        meter_details: valid_meter_details,
                        status: "pending",
                        state: true
                    });
                    if (bill_record) {
                        return res.status(200).json({
                            message: `Electricity Bill Payment Processing`,
                            bill_proceed: "*no7&*9)(&*£#&*(@!£$**£$sa",
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: `Error! Please try again.`,
                        });
                    }
                }
                else {
                    res.status(400).json({
                        message: 'Insufficient Funds. Please Deposit.'
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `You are not a registered user.`,
                });
            }
        }
        else {
            res.status(500).json({
                message: "Set Token in the local storage",
            });
        }
    }
    catch (error) {
        console.error("Error electricity bill payment", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.electricity_payment = electricity_payment;
