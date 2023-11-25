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
exports.onabill_signup_controller = void 0;
const input_validation_1 = require("../utilities/input_validation");
const authorization_1 = require("../utilities/authorization");
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const onabill_signup_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*------------------VALIDATING SIGNUP INPUT DATA - (START)-------------------------*/
        let valid_input_firstName = input_validation_1.firstName.validate(req.body.firstName);
        if (valid_input_firstName.error) {
            const error_message = valid_input_firstName.error.details[0].message;
            return res.status(400).json({ message: `firstName - ${error_message}` });
        }
        const valid_firstName = valid_input_firstName.value;
        let valid_input_lastName = input_validation_1.lastName.validate(req.body.lastName);
        if (valid_input_lastName.error) {
            const error_message = valid_input_lastName.error.details[0].message;
            return res.status(400).json({ message: `lastName - ${error_message}` });
        }
        const valid_lastName = valid_input_lastName.value;
        let valid_input_email = input_validation_1.email.validate(req.body.email);
        if (valid_input_email.error) {
            const error_message = valid_input_email.error.details[0].message;
            return res.status(400).json({ message: `email - ${error_message}` });
        }
        const valid_email = valid_input_email.value;
        let valid_input_phoneNumber = input_validation_1.phoneNumber.validate(req.body.phoneNumber);
        if (valid_input_phoneNumber.error) {
            const error_message = valid_input_phoneNumber.error.details[0].message;
            return res.status(400).json({ message: `phoneNumber - ${error_message}` });
        }
        const valid_phoneNumber = valid_input_phoneNumber.value;
        let valid_input_retype_phoneNumber = input_validation_1.retype_phoneNumber.validate(req.body.retype_phoneNumber);
        if (valid_input_retype_phoneNumber.error) {
            const error_message = valid_input_retype_phoneNumber.error.details[0].message;
            return res.status(400).json({ message: `retype_phoneNumber - ${error_message}` });
        }
        const valid_retype_phoneNumber = valid_input_retype_phoneNumber.value;
        let valid_input_password = input_validation_1.password.validate(req.body.password);
        if (valid_input_password.error) {
            const error_message = valid_input_password.error.details[0].message;
            return res.status(400).json({ message: `password - ${error_message}` });
        }
        const valid_password = valid_input_password.value;
        let valid_input_retype_password = input_validation_1.retype_password.validate(req.body.retype_password);
        if (valid_input_retype_password.error) {
            const error_message = valid_input_retype_password.error.details[0].message;
            return res.status(400).json({ message: `retype_password - ${error_message}` });
        }
        const valid_retype_password = valid_input_retype_password.value;
        /*------------------VALIDATING SIGN UP INPUT DATA - (STOP)-------------------------*/
        /*---------------------------- SIGNING USERS IN - (START) ----------------------------------*/
        if (valid_phoneNumber !== valid_retype_phoneNumber || valid_password !== valid_retype_password) {
            return res.status(400).json({
                message: 'Please confirm your details properly.'
            });
        }
        else {
            const checking_user_existence = yield signup_model_1.default.findOne({
                where: {
                    phoneNumber: valid_phoneNumber
                }
            });
            if (!checking_user_existence) {
                const hashPassword = yield (0, authorization_1.hashedPassword)(valid_password);
                const new_user = yield signup_model_1.default.create({
                    id: (0, uuid_1.v4)(),
                    firstName: valid_firstName,
                    lastName: valid_lastName,
                    email: valid_email,
                    phoneNumber: valid_phoneNumber,
                    password: hashPassword,
                    account_type: "customer",
                    referral_id: "",
                    service_status: true,
                    block: false
                });
                const new_user_created = yield signup_model_1.default.findOne({
                    where: {
                        phoneNumber: valid_phoneNumber
                    }
                });
                if (new_user_created) {
                    const new_user_id = new_user_created.dataValues.id;
                    const onabill_user_token = jsonwebtoken_1.default.sign({ id: new_user_id }, APP_SECRET, { expiresIn: "1d" });
                    return res.status(200).json({
                        user_data: new_user,
                        user_token: onabill_user_token
                    });
                }
                else {
                    res.status(400).json({
                        message: `Sign up error. Please try again.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `${valid_phoneNumber} is already signed up.`
                });
            }
        }
        /*---------------------------- SIGNING USERS IN - (STOP) ----------------------------------*/
    }
    catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.onabill_signup_controller = onabill_signup_controller;
