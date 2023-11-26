import { Request, Response } from 'express'
import { phoneNumber, password } from '../utilities/input_validation'
import Onabill_Signup, { SIGNUP } from '../db_model/signup.model'
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
import Client_Wallet, { WALLET }  from '../db_model/client_wallet.model'
import { v4 } from "uuid";


dotenv.config()
const { APP_SECRET } = process.env

export const onabill_login_controller = async(req:Request, res:Response) => {
try{

/*-----------------------------Validating Login Input - (START)-----------------------------------*/
let valid_input_phoneNumber = phoneNumber.validate(req.body.phoneNumber);
if (valid_input_phoneNumber.error) {
  const error_message = valid_input_phoneNumber.error.details[0].message;
  return res.status(400).json({ message: `phoneNumber - ${error_message}` });
}
const valid_phoneNumber = valid_input_phoneNumber.value;  

let valid_input_password = password.validate(req.body.password);
if (valid_input_password.error) {
  const error_message = valid_input_password.error.details[0].message;
  return res.status(400).json({ message: `password - ${error_message}` });
}
const valid_password = valid_input_password.value;

/*-----------------------------Validating Login Input - (STOP)-----------------------------------*/

/*------------------------------Logging users in - (START) ------------------------------------------*/
const checking_if_user_exists = await Onabill_Signup.findOne({
    where:{
        phoneNumber:valid_phoneNumber
    }
})

if(checking_if_user_exists){
    if(checking_if_user_exists.dataValues.block === false){
        
        if(checking_if_user_exists.dataValues.service_status === true){
            const validate_user = await bcrypt.compare(valid_password, checking_if_user_exists.dataValues.password);

            if(validate_user){
                const new_user_id = checking_if_user_exists.dataValues.id

                /*------------------Create Wallet - (START)-----------------------------*/
                const user_wallet = await Client_Wallet.findOne({
                    where: {
                        phoneNumber: checking_if_user_exists.dataValues.phoneNumber
                    }
                })

                    if(!user_wallet){

                    await Client_Wallet.create({
                    id:v4(),
                    phoneNumber: checking_if_user_exists.dataValues.phoneNumber,
                    wallet_balance: 10000
                    })
                 }
                /*------------------Create Wallet - (STOP)-----------------------------*/

                const onabill_login_token = jwt.sign({ id: new_user_id }, APP_SECRET!, { expiresIn: "1d" });

                res.status(200).json({
                    message:`LOGIN SUCCESSFUL!`,
                    account_type: checking_if_user_exists.dataValues.account_type,
                    login_token: onabill_login_token,
                    login_proceed: "true"
                })

            }else{
                res.status(400).json({
                    message: `Password is incorrect.`
                })
            }

        }else{
            res.status(400).json({
                message: `Please be patient, service will be up soon.`
            })
        }
    }else{
        res.status(400).json({
            message: `Account BLOCKED. Please contact customer care.`
        })
    }
}else{
    res.status(400).json({
        message: 'PLEASE SIGN UP!'
    })
}

/*------------------------------Logging users in - (STOP) ------------------------------------------*/

}catch(error){
    console.error("Error logging-in", error);
    return res.status(500).json({ error: "Internal server error" });
}
}