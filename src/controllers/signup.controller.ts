import { Request, Response } from 'express'
import { firstName, lastName, email, phoneNumber, retype_phoneNumber, password, retype_password } from '../utilities/input_validation'
import { hashedPassword } from '../utilities/authorization'
import Onabill_Signup, { SIGNUP } from '../db_model/signup.model'
import { v4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
const { APP_SECRET } = process.env

export const onabill_signup_controller = async(req:Request, res:Response) => {

  try{

        /*------------------VALIDATING SIGNUP INPUT DATA - (START)-------------------------*/
        let valid_input_firstName = firstName.validate(req.body.firstName);
        if (valid_input_firstName.error) {
          const error_message = valid_input_firstName.error.details[0].message;
          return res.status(400).json({ message: `firstName - ${error_message}` });
        }
        const valid_firstName = valid_input_firstName.value;
    
        let valid_input_lastName = lastName.validate(req.body.lastName);
        if (valid_input_lastName.error) {
          const error_message = valid_input_lastName.error.details[0].message;
          return res.status(400).json({ message: `lastName - ${error_message}` });
        }
        const valid_lastName = valid_input_lastName.value;
    
        let valid_input_email= email.validate(req.body.email);
        if (valid_input_email.error) {
          const error_message = valid_input_email.error.details[0].message;
          return res.status(400).json({ message: `email - ${error_message}` });
        }
        const valid_email = valid_input_email.value;
    
        let valid_input_phoneNumber = phoneNumber.validate(req.body.phoneNumber);
        if (valid_input_phoneNumber.error) {
          const error_message = valid_input_phoneNumber.error.details[0].message;
          return res.status(400).json({ message: `phoneNumber - ${error_message}` });
        }
        const valid_phoneNumber = valid_input_phoneNumber.value;        

        let valid_input_retype_phoneNumber = retype_phoneNumber.validate(req.body.retype_phoneNumber);
        if (valid_input_retype_phoneNumber.error) {
          const error_message = valid_input_retype_phoneNumber.error.details[0].message;
          return res.status(400).json({ message: `retype_phoneNumber - ${error_message}` });
        }
        const valid_retype_phoneNumber = valid_input_retype_phoneNumber.value;

        let valid_input_password = password.validate(req.body.password);
        if (valid_input_password.error) {
          const error_message = valid_input_password.error.details[0].message;
          return res.status(400).json({ message: `password - ${error_message}` });
        }
        const valid_password = valid_input_password.value;

        let valid_input_retype_password = retype_password.validate(req.body.retype_password);
        if (valid_input_retype_password.error) {
          const error_message = valid_input_retype_password.error.details[0].message;
          return res.status(400).json({ message: `retype_password - ${error_message}` });
        }
        const valid_retype_password = valid_input_retype_password.value;

/*------------------VALIDATING SIGN UP INPUT DATA - (STOP)-------------------------*/



/*---------------------------- SIGNING USERS IN - (START) ----------------------------------*/
    
if( valid_phoneNumber !== valid_retype_phoneNumber || valid_password !== valid_retype_password){
  return res.status(400).json({
    message: 'Please confirm your details properly.'
  })
}else{
  const checking_user_existence = await Onabill_Signup.findOne({
    where:{
      phoneNumber: valid_phoneNumber
    }
  })

  if(!checking_user_existence){
    const hashPassword: string = await hashedPassword(valid_password);

    const new_user = await Onabill_Signup.create({
      id:v4(),
      firstName:valid_firstName,
      lastName:valid_lastName,
      email:valid_email,
      phoneNumber:valid_phoneNumber,
      password:hashPassword,
      account_type: "customer",
      referral_id: "",
      service_status: true,
      block: false    
    })

    const new_user_created = await Onabill_Signup.findOne({
      where:{
        phoneNumber:valid_phoneNumber
      }
    })

    if(new_user_created){
      const new_user_id = new_user_created.dataValues.id

      const onabill_user_token = jwt.sign({ id: new_user_id }, APP_SECRET!, { expiresIn: "1d" });

      return res.status(200).json({
        user_data: new_user,
        user_token: onabill_user_token
      })

    }else {
      res.status(400).json({
        message: `Sign up error. Please try again.`
      })
    }

  }else{
    return res.status(400).json({
      message: `${valid_phoneNumber} is already signed up.`
    })
  }
}

/*---------------------------- SIGNING USERS IN - (STOP) ----------------------------------*/

  }catch(error){
    console.error("Error signing up:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}