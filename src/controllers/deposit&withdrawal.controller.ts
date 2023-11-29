import { Request, Response } from "express";
import Onabill_Signup, { SIGNUP } from "../db_model/signup.model";
import Client_Wallet, { WALLET } from "../db_model/client_wallet.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  deposit_amount,
  withdraw_amount,
  bankName,
  accountNumber,
} from "../utilities/input_validation";
import Deposit_Transactions, {
  TRANSACTION,
} from "../db_model/Deposit_transactions.model";
import Withrawal_Transactions, {
  TRANSACTIONS,
} from "../db_model/Withdrawal_transactions.model";

import { v4 } from "uuid";
import { Op } from "sequelize";

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;

export const deposit = async (req: Request, res: Response) => {
  try {
    /*-------------------------Validating Input -------------------------------*/
    let valid_input_deposit_amount = deposit_amount.validate(
      req.body.deposit_amount
    );
    if (valid_input_deposit_amount.error) {
      const error_message = valid_input_deposit_amount.error.details[0].message;
      return res
        .status(400)
        .json({ message: `deposit_amount - ${error_message}` });
    }
    const valid_deposit_amount = valid_input_deposit_amount.value;

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

        const created_transactions = await Deposit_Transactions.create({
          id: v4(),
          user_id: getting_customer_data.dataValues.id,
          date: transaction_time,
          tnx_id: v4(),
          type: "Deposit",
          amount: valid_deposit_amount,
          status: "pending",
          state: false,
        });

        if (created_transactions) {
          return res.status(200).json({
            message: `Transaction Processing`,
            deposit_proceed: "no7&*^&*(@!£$**£$sa",
          });
        } else {
          return res.status(400).json({
            message: `Error! Please try again.`,
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
    console.error("Error depositing", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const made_deposit = async (req: Request, res: Response) => {
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
        const find_user_transactions: any = await Deposit_Transactions.findAll({
          where: {
            [Op.and]: [
              { user_id: getting_customer_data.dataValues.id },
              { state: false },
            ],
          },
        });

        if (find_user_transactions) {
          const all_user_transactions_unsorted = find_user_transactions.map(
            (transaction: any) => {
              return transaction.dataValues;
            }
          );

          const all_user_transactions = all_user_transactions_unsorted.sort(
            (a: any, b: any) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
          );

          await Deposit_Transactions.update(
            { state: true },
            {
              where: {
                tnx_id: all_user_transactions[0].tnx_id,
              },
            }
          );

          return res.status(200).json({
            message: `Processing Payment...`,
            deposit_proceed_end: "no@7&*^77*&*(@!£$**£$sa",
          });
        } else {
          return res.status(400).json({
            message: `Transaction cancelled. Please try again`,
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
    console.error("Error making final deposit", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const withdrawal = async (req: Request, res: Response) => {
  try {
    /*-------------------------Validating Input -------------------------------*/
    let valid_input_withdraw_amount = withdraw_amount.validate(
      req.body.withdraw_amount
    );
    if (valid_input_withdraw_amount.error) {
      const error_message =
        valid_input_withdraw_amount.error.details[0].message;
      return res
        .status(400)
        .json({ message: `withdraw_amount - ${error_message}` });
    }
    const valid_withdraw_amount = valid_input_withdraw_amount.value;

    let valid_input_bankName = bankName.validate(req.body.bankName);
    if (valid_input_bankName.error) {
      const error_message = valid_input_bankName.error.details[0].message;
      return res.status(400).json({ message: `bankName - ${error_message}` });
    }
    const valid_bankName = valid_input_bankName.value;

    let valid_input_accountNumber = accountNumber.validate(
      req.body.accountNumber
    );
    if (valid_input_accountNumber.error) {
      const error_message = valid_input_accountNumber.error.details[0].message;
      return res
        .status(400)
        .json({ message: `accountNumber - ${error_message}` });
    }
    const valid_accountNumber = valid_input_accountNumber.value;

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

        const user_account_balance: any =
          checking_user_account?.dataValues.wallet_balance;

        if (+user_account_balance >= +valid_withdraw_amount) {
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

          const created_transactions = await Withrawal_Transactions.create({
            id: v4(),
            user_id: getting_customer_data.dataValues.id,
            date: transaction_time,
            tnx_id: v4(),
            type: "Withdrawal",
            amount: valid_withdraw_amount,
            status: "pending",
            state: false,
          });

          if (created_transactions) {
            return res.status(200).json({
              message: `Processing Withdrawal...`,
              withdrawal_proceed: "no7&*^&*(@!£$*$sa",
            });
          } else {
            return res.status(400).json({
              message: `Error! Please try again.`,
            });
          }
        } else {
          return res.status(400).json({
            message: `Insufficient Funds. Please deposit.`,
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
    console.error("Error making withdrawals", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const made_withdrawal = async (req: Request, res: Response) => {
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
        const find_user_transactions: any =
          await Withrawal_Transactions.findAll({
            where: {
              [Op.and]: [
                { user_id: getting_customer_data.dataValues.id },
                { state: false },
              ],
            },
          });

        if (find_user_transactions) {
          const all_user_transactions_unsorted = find_user_transactions.map(
            (transaction: any) => {
              return transaction.dataValues;
            }
          );

          const all_user_transactions = all_user_transactions_unsorted.sort(
            (a: any, b: any) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
          );
                   
          await Withrawal_Transactions.update(
            { state: true },
            {
              where: {
                tnx_id: all_user_transactions[0].tnx_id,
              },
            }
          );

          return res.status(200).json({
            message: `Processing Withdrawal...`,
          });
        } else {
          return res.status(400).json({
            message: `Withdrawal cancelled. Please try again`,
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
    console.error("Error making final withdrawals", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
