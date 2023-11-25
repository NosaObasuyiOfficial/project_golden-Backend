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
exports.onabill_login_controller = void 0;
const input_validation_1 = require("../utilities/input_validation");
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_wallet_model_1 = __importDefault(require("../db_model/client_wallet.model"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const onabill_login_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*-----------------------------Validating Login Input - (START)-----------------------------------*/
        let valid_input_phoneNumber = input_validation_1.phoneNumber.validate(req.body.phoneNumber);
        if (valid_input_phoneNumber.error) {
            const error_message = valid_input_phoneNumber.error.details[0].message;
            return res.status(400).json({ message: `phoneNumber - ${error_message}` });
        }
        const valid_phoneNumber = valid_input_phoneNumber.value;
        let valid_input_password = input_validation_1.password.validate(req.body.password);
        if (valid_input_password.error) {
            const error_message = valid_input_password.error.details[0].message;
            return res.status(400).json({ message: `password - ${error_message}` });
        }
        const valid_password = valid_input_password.value;
        /*-----------------------------Validating Login Input - (STOP)-----------------------------------*/
        /*------------------------------Logging users in - (START) ------------------------------------------*/
        const checking_if_user_exists = yield signup_model_1.default.findOne({
            where: {
                phoneNumber: valid_phoneNumber
            }
        });
        if (checking_if_user_exists) {
            if (checking_if_user_exists.dataValues.block === false) {
                if (checking_if_user_exists.dataValues.service_status === true) {
                    const validate_user = yield bcrypt_1.default.compare(valid_password, checking_if_user_exists.dataValues.password);
                    if (validate_user) {
                        const new_user_id = checking_if_user_exists.dataValues.id;
                        /*------------------Create Wallet - (START)-----------------------------*/
                        const user_wallet = yield client_wallet_model_1.default.findOne({
                            where: {
                                phoneNumber: checking_if_user_exists.dataValues.phoneNumber
                            }
                        });
                        if (!user_wallet) {
                            yield client_wallet_model_1.default.create({
                                id: (0, uuid_1.v4)(),
                                phoneNumber: checking_if_user_exists.dataValues.phoneNumber,
                                wallet_balance: 10000
                            });
                        }
                        /*------------------Create Wallet - (STOP)-----------------------------*/
                        const onabill_login_token = jsonwebtoken_1.default.sign({ id: new_user_id }, APP_SECRET, { expiresIn: "1d" });
                        res.status(200).json({
                            message: `LOGIN SUCCESSFUL!`,
                            account_type: checking_if_user_exists.dataValues.account_type,
                            login_token: onabill_login_token
                        });
                    }
                    else {
                        res.status(400).json({
                            message: `Password is incorrect.`
                        });
                    }
                }
                else {
                    res.status(400).json({
                        message: `Please be patient, service will be up soon.`
                    });
                }
            }
            else {
                res.status(400).json({
                    message: `Account BLOCKED. Please contact customer care.`
                });
            }
        }
        else {
            res.status(400).json({
                message: 'PLEASE SIGN UP!'
            });
        }
        /*------------------------------Logging users in - (STOP) ------------------------------------------*/
    }
    catch (error) {
        console.error("Error logging-in", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.onabill_login_controller = onabill_login_controller;
