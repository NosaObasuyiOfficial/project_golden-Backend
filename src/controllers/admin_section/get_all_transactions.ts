import {Request, Response} from 'express'
import { tnx_id, status} from "../../utilities/input_validation";
import Onabill_Admin_Signup, { SIGNUP } from "../../db_model/signup.model";
import Deposit_Transactions, {TRANSACTION,} from "../../db_model/Deposit_transactions.model";
import Withrawal_Transactions, {TRANSACTIONS,} from "../../db_model/Withdrawal_transactions.model";
import Electricity_Payment, { BILL_TRANSACTION } from '../../db_model/electric_bill.model'
import Onabill_Signup from "../../db_model/signup.model";

import jwt, { JwtPayload } from "jsonwebtoken";
import{ Op } from 'sequelize';

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;

export const all_transaction_records = async(req: Request, res: Response) => {
    try{

            const token: any = req.headers.authorization;

            if (token) {
                const token_info = token.split(" ")[1];
                const decodedToken: any = jwt.verify(token_info, APP_SECRET!);
          
                const admin_id = decodedToken.id;
          
                const getting_customer_data = await Onabill_Admin_Signup.findOne({
                  where: {
                    id: admin_id,
                  },
                });

                if (getting_customer_data?.dataValues) {

                    if(getting_customer_data.dataValues.account_type === 'onabill_admin_101'){

                        
            /*-----------------------GOTTEN ALL TRANSACTIONS - (START)------------------------------*/
                                
            /*-----------------------DEPOSIT TRANSACTIONS ------------------------------*/
                                
                      const find_user_transactions: any = await Deposit_Transactions.findAll({
                        where: {
                            state: true 
                        },
                      });
                    
                      const all_user_deposit_unsorted = find_user_transactions.map(
                        (transaction: any) => {
                          return transaction.dataValues;
                        }
                      );
                    
            /*-----------------------WITHDRAWAL TRANSACTIONS ------------------------------*/
                    
                      const find_user_withdrawals: any = await Withrawal_Transactions.findAll(
                        {
                          where: {
                             state: true 
                          },
                        }
                      );
                    
                      const all_user_withdrawals_unsorted = find_user_withdrawals.map(
                        (transaction: any) => {
                          return transaction.dataValues;
                        }
                );
                    

            /*-----------------------ELECTRICITY BILL TRANSACTIONS ------------------------------*/
                    
                      const find_electricity_bill_payment = await Electricity_Payment.findAll(
                        {
                          where: {
                            state: true
                         },
                        }
                      );
                    
                     const all_electricity_bills_unsorted =
                        find_electricity_bill_payment.map((electricity: any) => {
                          return electricity.dataValues;
                        });
                    
            /*-------------------------GOTTEN ALL TRANSACTIONS - (STOP)------------------------------*/    
            
            if( all_user_deposit_unsorted.length < 1 && all_user_withdrawals_unsorted.length < 1 && all_electricity_bills_unsorted.length < 1 ){
                return res.status(200).json({
                    data: [],
                  });
            }else{

                const all_users_transactions:any = []

                all_user_deposit_unsorted.map((deposit:any) => {
                    all_users_transactions.push(deposit)
                })

                all_user_withdrawals_unsorted.map((withdrawal:any) => {
                    all_users_transactions.push(withdrawal)
                })

                all_electricity_bills_unsorted.map((electricity:any) => {
                    all_users_transactions.push(electricity)
                })

                     const all_user_transactions = all_users_transactions.sort(
                       (a: any, b: any) => {
                         return (
                          new Date(b.createdAt).getTime() -
                           new Date(a.createdAt).getTime()
                         );
                       }
                     );

                     let entire_records:any = []


                     const all_received_transactions = await Promise.all(
                     all_user_transactions.map(async(received:any) => {
                        if(received.status === "pending" || received.status === "processing" ){
                           
                           const user_details = await Onabill_Signup.findOne({
                                where : {
                                    id: received.user_id
                                }
                            })

                            const user_name = {customer_name: `${user_details?.dataValues.firstName} ${user_details?.dataValues.lastName}`}
                            

                                const combinedData = { ...received, ...user_name };
                                entire_records.push(combinedData);

                        }
                     }))

                     return res.status(200).json({
                        data: entire_records
                      });
  
                    }

                    }else{
                        return res.status(400).json({
                            message: `You are not authorized to get this information`,
                          });                     
                    }

                }else {
                return res.status(400).json({
                  message: `You are not a registered admin.`,
                });
              }

            } else {
                res.status(500).json({
                  message: "Set Token in the local storage",
                });
              }

    }catch(error){
        console.error("Error getting all transactions", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}