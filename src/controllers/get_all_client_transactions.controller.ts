import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Onabill_Signup, { SIGNUP } from "../db_model/signup.model";

import Electricity_Payment, {
    BILL_TRANSACTION,
  } from "../db_model/electric_bill.model";
  import Deposit_Transactions, {
    TRANSACTION,
  } from "../db_model/Deposit_transactions.model";
  import Withrawal_Transactions, {
    TRANSACTIONS,
  } from "../db_model/Withdrawal_transactions.model";

import { Op } from "sequelize";

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;

export const all_client_transactions = async (req: Request, res: Response) => {
    try {
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


/*-----------------------GOTTEN ALL TRANSACTIONS - (START)------------------------------*/

/*-----------------------DEPOSIT TRANSACTIONS ------------------------------*/

          const find_user_transactions: any = await Deposit_Transactions.findAll({
            where: {
              [Op.and]: [
                { user_id: getting_customer_data.dataValues.id },
                { state: true },
              ],
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
                [Op.and]: [
                  { user_id: getting_customer_data.dataValues.id },
                  { state: true },
                ],
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
                [Op.and]: [
                  { user_id: getting_customer_data.dataValues.id },
                  { state: true },
                ],
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

                     return res.status(200).json({
                       data: all_user_transactions
                     });
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
      console.error("Error getting all user transactions", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };






//   if (all_electricity_bills_unsorted.length < 1) {
//     if (all_user_withdrawals_unsorted.length < 1) {
//       const all_user_transactions = all_user_transactions_unsorted.sort(
//         (a: any, b: any) => {
//           return (
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//           );
//         }
//       );

//       if (all_user_transactions.length >= 1) {
//         return res.status(200).json({
//           data: all_user_transactions,
//         });
//       } else if (all_user_transactions.length < 1) {
//         return res.status(200).json({
//           data: [],
//         });
//       }
//     } else {
//       all_user_withdrawals_unsorted.map((withdraw: any) => {
//         all_user_transactions_unsorted.push(withdraw);
//       });

//       const all_user_transactions = all_user_transactions_unsorted.sort(
//         (a: any, b: any) => {
//           return (
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//           );
//         }
//       );

//       if (all_user_transactions.length >= 1) {
//         return res.status(200).json({
//           data: all_user_transactions,
//         });
//       } else if (all_user_transactions.length < 1) {
//         return res.status(200).json({
//           data: [],
//         });
//       }
//     }
//   } else {
//     all_electricity_bills_unsorted.map((electric: any) => {
//       all_user_transactions_unsorted.push(electric);
//     });

//     all_user_withdrawals_unsorted.map((withdraw: any) => {
//       all_user_transactions_unsorted.push(withdraw);
//     });

//     const all_user_transactions = all_user_transactions_unsorted.sort(
//       (a: any, b: any) => {
//         return (
//           new Date(b.createdAt).getTime() -
//           new Date(a.createdAt).getTime()
//         );
//       }
//     );

//     if (all_user_transactions.length >= 1) {
//       return res.status(200).json({
//         data: all_user_transactions,
//       });
//     } else if (all_user_transactions.length < 1) {
//       return res.status(200).json({
//         data: [],
//       });
//     }
//   }



