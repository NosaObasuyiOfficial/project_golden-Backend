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
exports.get_meter_details = exports.add_meter = void 0;
const input_validation_1 = require("../utilities/input_validation");
const signup_model_1 = __importDefault(require("../db_model/signup.model"));
const meter_model_1 = __importDefault(require("../db_model/meter.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_SECRET } = process.env;
const add_meter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*-------------------------Validating Input -------------------------------*/
        let valid_input_meter_name = input_validation_1.meter_name.validate(req.body.meter_name);
        if (valid_input_meter_name.error) {
            const error_message = valid_input_meter_name.error.details[0].message;
            return res.status(400).json({ message: `meter_name - ${error_message}` });
        }
        const valid_meter_name = valid_input_meter_name.value;
        let valid_input_meter_number = input_validation_1.meter_number.validate(req.body.meter_number);
        if (valid_input_meter_number.error) {
            const error_message = valid_input_meter_number.error.details[0].message;
            return res.status(400).json({ message: `meter_number - ${error_message}` });
        }
        const valid_meter_number = valid_input_meter_number.value;
        let valid_input_meter_type = input_validation_1.meter_type.validate(req.body.meter_type);
        if (valid_input_meter_type.error) {
            const error_message = valid_input_meter_type.error.details[0].message;
            return res.status(400).json({ message: `meter_type - ${error_message}` });
        }
        const valid_meter_type = valid_input_meter_type.value;
        let valid_input_state = input_validation_1.state.validate(req.body.state);
        if (valid_input_state.error) {
            const error_message = valid_input_state.error.details[0].message;
            return res.status(400).json({ message: `state - ${error_message}` });
        }
        const valid_state = valid_input_state.value;
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
                const added_meter = yield meter_model_1.default.create({
                    id: (0, uuid_1.v4)(),
                    user_id: getting_customer_data.dataValues.id,
                    phoneNumber: getting_customer_data.dataValues.phoneNumber,
                    meter_name: valid_meter_name,
                    meter_number: valid_meter_number,
                    meter_type: valid_meter_type,
                    state: valid_state
                });
                res.status(200).json({
                    message: `Meter Added!`,
                    data: added_meter
                });
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
        console.error("Error adding meter", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.add_meter = add_meter;
const get_meter_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const getting_meter_details = yield meter_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { user_id: getting_customer_data.dataValues.id },
                            { phoneNumber: getting_customer_data.dataValues.phoneNumber },
                        ]
                    }
                });
                if (getting_meter_details) {
                    const meter_details_gotten = getting_meter_details.map((meter) => {
                        return { select_meter: `${meter.dataValues.meter_name} ${meter.dataValues.meter_number} ${meter.dataValues.meter_type} ${meter.dataValues.state}` };
                    });
                    res.status(200).json({
                        message: `All meter details gotten.`,
                        data: meter_details_gotten
                    });
                }
                else {
                    res.status(200).json({
                        data: [],
                        message: `All meter details gotten.`
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
        console.error("Error adding meter", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.get_meter_details = get_meter_details;
