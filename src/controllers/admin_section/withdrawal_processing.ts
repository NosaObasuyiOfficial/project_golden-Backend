import { Request, Response } from "express";
import { tnx_id, status } from "../../utilities/input_validation";
import Onabill_Admin_Signup, { SIGNUP } from "../../db_model/signup.model";
import Onabill_Signup from "../../db_model/signup.model";
import Client_Wallet from "../../db_model/client_wallet.model";
import Withdrawal_Transactions, {
  TRANSACTIONS,
} from "../../db_model/Withdrawal_transactions.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Op } from "sequelize";

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;

export const withdrawal_processing = async (req: Request, res: Response) => {
  try {
    /*-------------------------Validating Input -------------------------------*/
    let valid_input_tnx_id = tnx_id.validate(req.body.tnx_id);
    if (valid_input_tnx_id.error) {
      const error_message = valid_input_tnx_id.error.details[0].message;
      return res.status(400).json({ message: `tnx_id - ${error_message}` });
    }
    const valid_tnx_id = valid_input_tnx_id.value;

    let valid_input_status = status.validate(req.body.status);
    if (valid_input_status.error) {
      const error_message = valid_input_status.error.details[0].message;
      return res.status(400).json({ message: `status - ${error_message}` });
    }
    const valid_status = valid_input_status.value;

    /*-------------------------Validating Input -------------------------------*/

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
        if (
          getting_customer_data.dataValues.account_type === "onabill_admin_101"
        ) {
          const getting_specific_transactions =
            await Withdrawal_Transactions.findOne({
              where: {
                tnx_id: valid_tnx_id,
              },
            });

          if (getting_specific_transactions) {

            if(getting_specific_transactions.dataValues.status !== 'success'){
            const find_user_id =
              getting_specific_transactions.dataValues.user_id;

            const getting_user_phoneNumber = await Onabill_Signup.findOne({
              where: {
                id: find_user_id,
              },
            });

            if (getting_user_phoneNumber) {
              const find_user_phoneNumber =
                getting_user_phoneNumber.dataValues.phoneNumber;

              const getting_user_wallet_balance = await Client_Wallet.findOne({
                where: {
                  phoneNumber: find_user_phoneNumber,
                },
              });

              if (valid_status === "success") {

                const find_user_wallet_balance: any =
                  getting_user_wallet_balance?.dataValues.wallet_balance;

                const withdrawal_amount =
                  getting_specific_transactions.dataValues.amount;

                await Withdrawal_Transactions.update(
                  { status: valid_status },
                  {
                    where: {
                      [Op.and]: [
                        { tnx_id: valid_tnx_id },
                        { user_id: find_user_id },
                      ],
                    },
                  }
                );

                const withdrawal_balance =
                  find_user_wallet_balance - withdrawal_amount;

                await Client_Wallet.update(
                  { wallet_balance: withdrawal_balance },
                  {
                    where: {
                      phoneNumber: find_user_phoneNumber,
                    },
                  }
                );

                return res.status(200).json({
                  message: `Withdrawal Completed!`,
                  final_processing: "onabill781"
                });
              } else if (valid_status === "processing") {
                if (
                  getting_specific_transactions.dataValues.status ===
                  "processing"
                ) {
                  return res.status(400).json({
                    message: `This transaction has already processing by an admin.`,
                  });
                }

                const updating_user_transactions: any =
                  await Withdrawal_Transactions.update(
                    { status: valid_status },
                    {
                      where: {
                        [Op.and]: [
                          { tnx_id: valid_tnx_id },
                          { user_id: find_user_id },
                        ],
                      },
                    }
                  );

                return res.status(200).json({
                  message: `Transaction status updated.`,
                });
              } else if (valid_status === "failed") {
                if (
                  getting_specific_transactions.dataValues.status === "failed"
                ) {
                  return res.status(400).json({
                    message: `This transaction has already been marked as failed.`,
                  });
                }
                const updating_user_transactions: any =
                  await Withdrawal_Transactions.update(
                    { status: valid_status },
                    {
                      where: {
                        [Op.and]: [
                          { tnx_id: valid_tnx_id },
                          { user_id: find_user_id },
                        ],
                      },
                    }
                  );

                return res.status(200).json({
                  message: `Transaction status updated.`,
                });
              }
            } else {
              return res.status(400).json({
                message: `Cannot find this customer information.`,
              });
            }

          }else{
            return res.status(400).json({
              message: `This transaction has already been processed.`
            })
          }

          } else {
            return res.status(404).json({
              message: `Cannot find this transaction.`,
            });
          }
        } else {
          return res.status(400).json({
            message: `You are not authorized to make this transaction.`,
          });
        }
      } else {
        return res.status(400).json({
          message: `You are not a registered admin.`,
        });
      }
    } else {
      res.status(500).json({
        message: "Set Token in the local storage",
      });
    }
  } catch (error) {
    console.error("Error processing withdrawal", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
