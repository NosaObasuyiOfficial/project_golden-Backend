import Joi from 'joi'

export const firstName = Joi.string().trim().required()
    .messages({
        'any.required': 'First Name is required'
    })

export const lastName = Joi.string().trim().required()
    .messages({
        'any.required': 'Last Name is required'
    })

 export const email = Joi.string().email().trim().required()
    .messages({
        'any.required': 'Email is required'
    })

 export const phoneNumber = Joi.number().required().min(100000).max(200000000000000)
    .messages({
        'number.base': 'Phone number must be a number',
        'any.required': 'Please confirm phone number',
    })

 export const retype_phoneNumber = Joi.number().required().min(100000).max(200000000000000)
    .messages({
        'number.base': 'Phone number must be a number',
        'any.required': 'Please confirm phone number'
    })

 export const password = Joi.string().trim().min(7).max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least 7 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      'any.required': 'Password is required',
    })

  export const retype_password = Joi.string().trim().min(7).max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least 7 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      'any.required': 'Please confirm password',
    })

 export const account_type = Joi.string().required().allow('')

 export const referral_id = Joi.string().required().allow('')

 export const service_status = Joi.boolean().required().allow('')
 
 export const block = Joi.boolean().required().allow('')

 export const deposit_amount = Joi.number().required().min(999)
    .messages({
        'number.base': 'Phone number must be a number',
        'number.min': 'Number must be above NGN 999',
    })

 export const withdraw_amount = Joi.number().required()
    .messages({
        'any.required': 'withdraw amount is required'
    })

 export const bankName = Joi.string().trim().required()
     .messages({
        'any.required': ' bank Name is required'
    })

 export const accountNumber = Joi.string().trim().required()
    .messages({
        'any.required': 'Account Number is required'
    })


 export const meter_name = Joi.string().trim().required()
 .messages({
    'any.required': 'Meter Name is required'
 })

 export const meter_number = Joi.string().trim().required()
 .messages({
    'any.required': 'Meter Number is required'
 })

 export const meter_type = Joi.string().trim().required()
 .messages({
    'any.required': 'Meter Type is required'
 })

 export const state = Joi.string().trim().required()
 .messages({
    'any.required': 'State is required'
 })

 export const bill_amount = Joi.number().required().min(499)
 .messages({
     'any.required': 'bill amount is required'
 })

 export const meter_details = Joi.string().trim().required()
 .messages({
    'any.required': 'Meter details is required'
 })



















