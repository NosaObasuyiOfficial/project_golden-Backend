import {Request, Response} from 'express'
import { meter_name, meter_number, meter_type, state } from "../utilities/input_validation";
import Onabill_Signup, { SIGNUP } from "../db_model/signup.model";
import Client_Meter_Details, { METER } from "../db_model/meter.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 } from "uuid";
import{ Op } from 'sequelize';


import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;


export const add_meter = async(req:Request, res:Response) => {
    try{
          /*-------------------------Validating Input -------------------------------*/
        let valid_input_meter_name = meter_name.validate(req.body.meter_name);
        if (valid_input_meter_name.error) {
          const error_message = valid_input_meter_name.error.details[0].message;
          return res.status(400).json({ message: `meter_name - ${error_message}` });
        }
        const valid_meter_name = valid_input_meter_name.value;
    
    
        let valid_input_meter_number= meter_number.validate(req.body.meter_number);
        if (valid_input_meter_number.error) {
          const error_message = valid_input_meter_number.error.details[0].message;
          return res.status(400).json({ message: `meter_number - ${error_message}` });
        }
        const valid_meter_number = valid_input_meter_number.value;
    
    
        let valid_input_meter_type = meter_type.validate(req.body.meter_type);
        if (valid_input_meter_type.error) {
          const error_message = valid_input_meter_type.error.details[0].message;
          return res.status(400).json({ message: `meter_type - ${error_message}` });
        }
        const valid_meter_type = valid_input_meter_type.value;
    

        let valid_input_state = state.validate(req.body.state);
        if (valid_input_state.error) {
          const error_message = valid_input_state.error.details[0].message;
          return res.status(400).json({ message: `state - ${error_message}` });
        }
        const valid_state = valid_input_state.value;
    
          /*-------------------------Validating Input -------------------------------*/

          const token: any = req.headers.authorization;

          if (token) {
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, APP_SECRET!);
      
            const customer_id = decodedToken.id;
      
            const getting_customer_data = await Onabill_Signup.findOne({
              where: {
                id: customer_id,
              },
            });

            if (getting_customer_data?.dataValues) {

              const meter_length = await Client_Meter_Details.findAll({
                where: {
                  [Op.and]: [
                    {
                      phoneNumber: getting_customer_data.dataValues.phoneNumber
                    },
                    {
                      user_id: customer_id 
                    }
                  ]
                }
              })

              const max_meter_num =  meter_length.map((meter:any) => {
               return meter.dataValues
              })

              if( max_meter_num.length > 10){
               res.status(400).json({
                 message: `Maximum meter no. reached.`
                })
              }else{

               const added_meter = await Client_Meter_Details.create({
                    id: v4(),
                    user_id: getting_customer_data.dataValues.id,
                    phoneNumber: getting_customer_data.dataValues.phoneNumber,
                    meter_name: valid_meter_name,
                    meter_number: valid_meter_number,
                    meter_type: valid_meter_type,
                    state: valid_state
               })
            
                 res.status(200).json({
                  message: `Meter Added!`,
                  data: added_meter
                 })
              }

            } else {
                return res.status(400).json({
                  message: `You are not a registered user.`,
                });
              }
          } else {
            res.status(500).json({
              message: "Set Token in the local storage",
            });
          }
    }catch(error){
        console.error("Error adding meter", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const get_meter_details = async(req:Request, res:Response) => {
    try{

          const token: any = req.headers.authorization;

          if (token) {
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, APP_SECRET!);
      
            const customer_id = decodedToken.id;
      
            const getting_customer_data = await Onabill_Signup.findOne({
              where: {
                id: customer_id,
              },
            });

            if (getting_customer_data?.dataValues) {

           const getting_meter_details: any = await Client_Meter_Details.findAll({
            where: {
              [Op.and]: [
                  { user_id: getting_customer_data.dataValues.id },
                  { phoneNumber: getting_customer_data.dataValues.phoneNumber },
              ]
            }
          });

          if(getting_meter_details){

              const meter_details_gotten = getting_meter_details.map(
                (meter: any) => {
                  return { select_meter: `${meter.dataValues.meter_name} ${meter.dataValues.meter_number} ${meter.dataValues.meter_type} ${meter.dataValues.state}` }
                }
              );
    
              res.status(200).json({
                message: `All meter details gotten.`,
                data: meter_details_gotten
              })

          }else{
            res.status(200).json({
                data: [],
                message: `All meter details gotten.`
              })
          }
            } else {
                return res.status(400).json({
                  message: `You are not a registered user.`,
                });
              }
          } else {
            res.status(500).json({
              message: "Set Token in the local storage",
            });
          }
    }catch(error){
        console.error("Error adding meter", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}











































