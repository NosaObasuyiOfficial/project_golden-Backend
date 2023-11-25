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
exports.made_withdrawal = exports.withdrawal = exports.made_deposit = exports.deposit = void 0;
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const client_wallet_model_1 = __importDefault(require("../db_model/client_wallet.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const input_validation_1 = require("../utilities/input_validation");
const Deposit_transactions_model_1 = __importDefault(require("../db_model/Deposit_transactions.model"));
const Withdrawal_transactions_model_1 = __importDefault(require("../db_model/Withdrawal_transactions.model"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*-------------------------Validating Input -------------------------------*/
        let valid_input_deposit_amount = input_validation_1.deposit_amount.validate(req.body.deposit_amount);
        if (valid_input_deposit_amount.error) {
            const error_message = valid_input_deposit_amount.error.details[0].message;
            return res
                .status(400)
                .json({ message: `deposit_amount - ${error_message}` });
        }
        const valid_deposit_amount = valid_input_deposit_amount.value;
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
                const created_transactions = yield Deposit_transactions_model_1.default.create({
                    id: (0, uuid_1.v4)(),
                    user_id: getting_customer_data.dataValues.id,
                    date: transaction_time,
                    tnx_id: (0, uuid_1.v4)(),
                    type: "Deposit",
                    amount: valid_deposit_amount,
                    status: "pending",
                    state: false,
                });
                if (created_transactions) {
                    return res.status(200).json({
                        message: `Transaction Processing`,
                        deposit_proceed: "no7&*^&*(@!£$**£$sa",
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Error! Please try again.`,
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
        console.error("Error depositing", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.deposit = deposit;
const made_deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                const find_user_transactions = yield Deposit_transactions_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { state: false },
                        ],
                    },
                });
                if (find_user_transactions) {
                    const all_user_transactions_unsorted = find_user_transactions.map((transaction) => {
                        return transaction.dataValues;
                    });
                    const all_user_transactions = all_user_transactions_unsorted.sort((a, b) => {
                        return (new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime());
                    });
                    yield Deposit_transactions_model_1.default.update({ state: true }, {
                        where: {
                            tnx_id: all_user_transactions[0].tnx_id,
                        },
                    });
                    return res.status(200).json({
                        message: `Processing Payment...`,
                        deposit_proceed_end: "no@7&*^77*&*(@!£$**£$sa",
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Transaction cancelled. Please try again`,
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
        console.error("Error making final deposit", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.made_deposit = made_deposit;
const withdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*-------------------------Validating Input -------------------------------*/
        let valid_input_withdraw_amount = input_validation_1.withdraw_amount.validate(req.body.withdraw_amount);
        if (valid_input_withdraw_amount.error) {
            const error_message = valid_input_withdraw_amount.error.details[0].message;
            return res
                .status(400)
                .json({ message: `withdraw_amount - ${error_message}` });
        }
        const valid_withdraw_amount = valid_input_withdraw_amount.value;
        let valid_input_bankName = input_validation_1.bankName.validate(req.body.bankName);
        if (valid_input_bankName.error) {
            const error_message = valid_input_bankName.error.details[0].message;
            return res.status(400).json({ message: `bankName - ${error_message}` });
        }
        const valid_bankName = valid_input_bankName.value;
        let valid_input_accountNumber = input_validation_1.accountNumber.validate(req.body.accountNumber);
        if (valid_input_accountNumber.error) {
            const error_message = valid_input_accountNumber.error.details[0].message;
            return res
                .status(400)
                .json({ message: `accountNumber - ${error_message}` });
        }
        const valid_accountNumber = valid_input_accountNumber.value;
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
                if (+user_account_balance >= +valid_withdraw_amount) {
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
                    const created_transactions = yield Withdrawal_transactions_model_1.default.create({
                        id: (0, uuid_1.v4)(),
                        user_id: getting_customer_data.dataValues.id,
                        date: transaction_time,
                        tnx_id: (0, uuid_1.v4)(),
                        type: "Withdrawal",
                        amount: valid_withdraw_amount,
                        status: "pending",
                        state: false,
                    });
                    if (created_transactions) {
                        return res.status(200).json({
                            message: `Processing Withdrawal...`,
                            withdrawal_proceed: "no7&*^&*(@!£$*$sa",
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: `Error! Please try again.`,
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: `Insufficient Funds. Please deposit.`,
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
        console.error("Error making withdrawals", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.withdrawal = withdrawal;
const made_withdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                const find_user_transactions = yield Withdrawal_transactions_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { state: false },
                        ],
                    },
                });
                if (find_user_transactions) {
                    const all_user_transactions_unsorted = find_user_transactions.map((transaction) => {
                        return transaction.dataValues;
                    });
                    const all_user_transactions = all_user_transactions_unsorted.sort((a, b) => {
                        return (new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime());
                    });
                    yield Withdrawal_transactions_model_1.default.update({ state: true }, {
                        where: {
                            tnx_id: all_user_transactions[0].tnx_id,
                        },
                    });
                    return res.status(200).json({
                        message: `Processing Withdrawal...`,
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Withdrawal cancelled. Please try again`,
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
        console.error("Error making final withdrawals", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.made_withdrawal = made_withdrawal;
