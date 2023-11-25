"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meter_details = exports.bill_amount = exports.state = exports.meter_type = exports.meter_number = exports.meter_name = exports.accountNumber = exports.bankName = exports.withdraw_amount = exports.deposit_amount = exports.block = exports.service_status = exports.referral_id = exports.account_type = exports.retype_password = exports.password = exports.retype_phoneNumber = exports.phoneNumber = exports.email = exports.lastName = exports.firstName = void 0;
const joi_1 = __importDefault(require("joi"));
exports.firstName = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'First Name is required'
});
exports.lastName = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Last Name is required'
});
exports.email = joi_1.default.string().email().trim().required()
    .messages({
    'any.required': 'Email is required'
});
exports.phoneNumber = joi_1.default.number().required().min(100000).max(200000000000000)
    .messages({
    'number.base': 'Phone number must be a number',
    'any.required': 'Please confirm phone number',
});
exports.retype_phoneNumber = joi_1.default.number().required().min(100000).max(200000000000000)
    .messages({
    'number.base': 'Phone number must be a number',
    'any.required': 'Please confirm phone number'
});
exports.password = joi_1.default.string().trim().min(7).max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 7 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    'any.required': 'Password is required',
});
exports.retype_password = joi_1.default.string().trim().min(7).max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 7 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    'any.required': 'Please confirm password',
});
exports.account_type = joi_1.default.string().required().allow('');
exports.referral_id = joi_1.default.string().required().allow('');
exports.service_status = joi_1.default.boolean().required().allow('');
exports.block = joi_1.default.boolean().required().allow('');
exports.deposit_amount = joi_1.default.number().required().min(999)
    .messages({
    'number.base': 'Phone number must be a number',
    'number.min': 'Number must be above NGN 999',
});
exports.withdraw_amount = joi_1.default.number().required()
    .messages({
    'any.required': 'withdraw amount is required'
});
exports.bankName = joi_1.default.string().trim().required()
    .messages({
    'any.required': ' bank Name is required'
});
exports.accountNumber = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Account Number is required'
});
exports.meter_name = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Meter Name is required'
});
exports.meter_number = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Meter Number is required'
});
exports.meter_type = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Meter Type is required'
});
exports.state = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'State is required'
});
exports.bill_amount = joi_1.default.number().required().min(499)
    .messages({
    'any.required': 'bill amount is required'
});
exports.meter_details = joi_1.default.string().trim().required()
    .messages({
    'any.required': 'Meter details is required'
});
