import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Onabill_Signup, { SIGNUP } from "../db_model/signup.model";
import { bill_amount, meter_details } from "../utilities/input_validation";
import Electricity_Payment, {
  BILL_TRANSACTION,
} from "../db_model/electric_bill.model";
import Client_Wallet, { WALLET } from "../db_model/client_wallet.model";


import { v4 } from "uuid";

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;

export const electricity_payment = async (req: Request, res: Response) => {
  try {
    /*-------------------------Validating Input -------------------------------*/

    let valid_input_bill_amount = bill_amount.validate(req.body.bill_amount);
    if (valid_input_bill_amount.error) {
      const error_message = valid_input_bill_amount.error.details[0].message;
      return res
        .status(400)
        .json({ message: `bill_amount - ${error_message}` });
    }
    const valid_bill_amount = valid_input_bill_amount.value;

    let valid_input_meter_details = meter_details.validate( req.body.meter_details );
    if (valid_input_meter_details.error) {
      const error_message = valid_input_meter_details.error.details[0].message;
      return res
        .status(400)
        .json({ message: `meter_details - ${error_message}` });
    }
    const valid_meter_details = valid_input_meter_details.value;

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
            
        const checking_user_account = await Client_Wallet.findOne({
            where: {
              phoneNumber: getting_customer_data.dataValues.phoneNumber,
            },
          });

          const user_account_balance: any = checking_user_account?.dataValues.wallet_balance;

        if(user_account_balance >=  +valid_bill_amount){

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

        const bill_record = await Electricity_Payment.create({
          id: v4(),
          user_id: getting_customer_data.dataValues.id,
          date: transaction_time,
          phoneNumber: getting_customer_data.dataValues.phoneNumber,
          tnx_id: v4(),
          type: "Electricity Bill",
          amount: valid_bill_amount,
          meter_details: valid_meter_details,
          status: "pending",
          state: true
        });

        if (bill_record) {
          return res.status(200).json({
            message: `Electricity Bill Payment Processing`,
            bill_proceed: "*no7&*9)(&*£#&*(@!£$**£$sa",
          });

        } else {
          return res.status(400).json({
            message: `Error! Please try again.`,
          });
        }

        }else{
            res.status(400).json({
                message: 'Insufficient Funds. Please Deposit.'
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
  } catch (error) {
    console.error("Error electricity bill payment", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};









































































