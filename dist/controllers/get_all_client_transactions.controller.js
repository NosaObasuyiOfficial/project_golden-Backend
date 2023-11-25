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
exports.all_client_transactions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const electric_bill_model_1 = __importDefault(require("../db_model/electric_bill.model"));
const Deposit_transactions_model_1 = __importDefault(require("../db_model/Deposit_transactions.model"));
const Withdrawal_transactions_model_1 = __importDefault(require("../db_model/Withdrawal_transactions.model"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const all_client_transactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                /*-----------------------GOTTEN ALL TRANSACTIONS - (START)------------------------------*/
                /*-----------------------DEPOSIT TRANSACTIONS ------------------------------*/
                const find_user_transactions = yield Deposit_transactions_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { state: true },
                        ],
                    },
                });
                const all_user_deposit_unsorted = find_user_transactions.map((transaction) => {
                    return transaction.dataValues;
                });
                /*-----------------------WITHDRAWAL TRANSACTIONS ------------------------------*/
                const find_user_withdrawals = yield Withdrawal_transactions_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { state: true },
                        ],
                    },
                });
                const all_user_withdrawals_unsorted = find_user_withdrawals.map((transaction) => {
                    return transaction.dataValues;
                });
                /*-----------------------ELECTRICITY BILL TRANSACTIONS ------------------------------*/
                const find_electricity_bill_payment = yield electric_bill_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { state: true },
                        ],
                    },
                });
                const all_electricity_bills_unsorted = find_electricity_bill_payment.map((electricity) => {
                    return electricity.dataValues;
                });
                /*-------------------------GOTTEN ALL TRANSACTIONS - (STOP)------------------------------*/
                if (all_user_deposit_unsorted.length < 1 && all_user_withdrawals_unsorted.length < 1 && all_electricity_bills_unsorted.length < 1) {
                    return res.status(200).json({
                        data: [],
                    });
                }
                else {
                    const all_users_transactions = [];
                    all_user_deposit_unsorted.map((deposit) => {
                        all_users_transactions.push(deposit);
                    });
                    all_user_withdrawals_unsorted.map((withdrawal) => {
                        all_users_transactions.push(withdrawal);
                    });
                    all_electricity_bills_unsorted.map((electricity) => {
                        all_users_transactions.push(electricity);
                    });
                    const all_user_transactions = all_users_transactions.sort((a, b) => {
                        return (new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime());
                    });
                    return res.status(200).json({
                        data: all_user_transactions
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
        console.error("Error getting all user transactions", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.all_client_transactions = all_client_transactions;
//   if (all_electricity_bills_unsorted.length < 1) {
//     if (all_user_withdrawals_unsorted.length < 1) {
//       const all_user_transactions = all_user_transactions_unsorted.sort(
//         (a: any, b: any) => {
//           return (
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//           );
//         }
//       );
//       if (all_user_transactions.length >= 1) {
//         return res.status(200).json({
//           data: all_user_transactions,
//         });
//       } else if (all_user_transactions.length < 1) {
//         return res.status(200).json({
//           data: [],
//         });
//       }
//     } else {
//       all_user_withdrawals_unsorted.map((withdraw: any) => {
//         all_user_transactions_unsorted.push(withdraw);
//       });
//       const all_user_transactions = all_user_transactions_unsorted.sort(
//         (a: any, b: any) => {
//           return (
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//           );
//         }
//       );
//       if (all_user_transactions.length >= 1) {
//         return res.status(200).json({
//           data: all_user_transactions,
//         });
//       } else if (all_user_transactions.length < 1) {
//         return res.status(200).json({
//           data: [],
//         });
//       }
//     }
//   } else {
//     all_electricity_bills_unsorted.map((electric: any) => {
//       all_user_transactions_unsorted.push(electric);
//     });
//     all_user_withdrawals_unsorted.map((withdraw: any) => {
//       all_user_transactions_unsorted.push(withdraw);
//     });
//     const all_user_transactions = all_user_transactions_unsorted.sort(
//       (a: any, b: any) => {
//         return (
//           new Date(b.createdAt).getTime() -
//           new Date(a.createdAt).getTime()
//         );
//       }
//     );
//     if (all_user_transactions.length >= 1) {
//       return res.status(200).json({
//         data: all_user_transactions,
//       });
//     } else if (all_user_transactions.length < 1) {
//       return res.status(200).json({
//         data: [],
//       });
//     }
//   }
