import {Request, Response} from 'express'
import { tnx_id, status} from "../../utilities/input_validation";
import Onabill_Admin_Signup, { SIGNUP } from "../../db_model/signup.model";
import Onabill_Signup from "../../db_model/signup.model";
import Client_Wallet from "../../db_model/client_wallet.model";
import Deposit_Transactions, { TRANSACTION } from '../../db_model/Deposit_transactions.model'
import jwt, { JwtPayload } from "jsonwebtoken";
import{ Op } from 'sequelize';

import dotenv from "dotenv";

dotenv.config();
const { APP_SECRET } = process.env;


export const deposit_processing = async(req: Request, res: Response) => {
    try{
          /*-------------------------Validating Input -------------------------------*/
          let valid_input_tnx_id = tnx_id.validate(req.body.tnx_id);
          if (valid_input_tnx_id.error) {
            const error_message = valid_input_tnx_id.error.details[0].message;
            return res.status(400).json({ message: `tnx_id - ${error_message}` });
          }
          const valid_tnx_id = valid_input_tnx_id .value;
      
      
          let valid_input_status =  status.validate(req.body.status);
          if (valid_input_status.error) {
            const error_message = valid_input_status.error.details[0].message;
            return res.status(400).json({ message: `status - ${error_message}` });
          }
          const valid_status  = valid_input_status.value;
      
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

                    if(getting_customer_data.dataValues.account_type === 'onabill_admin_101'){

                        const getting_specific_transactions = await Deposit_Transactions.findOne({
                            where:{
                                tnx_id:  valid_tnx_id
                            }
                        })

                        if( getting_specific_transactions ){

                          if(getting_specific_transactions.dataValues.status !== 'success'){

                            const find_user_id = getting_specific_transactions.dataValues.user_id

                            const getting_user_phoneNumber = await Onabill_Signup.findOne({
                                where:{
                                    id: find_user_id
                                }
                            })

                            if(getting_user_phoneNumber){
                                const find_user_phoneNumber = getting_user_phoneNumber.dataValues.phoneNumber

                                const getting_user_wallet_balance = await Client_Wallet.findOne({
                                    where: {
                                        phoneNumber: find_user_phoneNumber
                                    }
                                })


                                if(valid_status === "success"){
                               const find_user_wallet_balance:any = getting_user_wallet_balance?.dataValues.wallet_balance
                               const deposit_amount = getting_specific_transactions.dataValues.amount

                               if( +deposit_amount <= 10000){

                                const amount_to_deposit = (deposit_amount - 90) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            

                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }
                               else if( +deposit_amount > 10000 && +deposit_amount <= 20000 ) {

                                const amount_to_deposit = (deposit_amount - 180) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })

                               }

                               else if( +deposit_amount > 20000 && +deposit_amount <= 30000 ) {

                                const amount_to_deposit = (deposit_amount - 250) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })

                               }
                               
                               else if( +deposit_amount > 30000 && +deposit_amount <= 40000 ){

                                const amount_to_deposit = (deposit_amount - 300) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  ); 

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }else if(  +deposit_amount > 40000 && +deposit_amount <= 50000 ){

                                const amount_to_deposit = (deposit_amount - 400) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })

                               }else if( +deposit_amount > 50000 && +deposit_amount <= 60000 ){
                                const amount_to_deposit = (deposit_amount - 450) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }else if( +deposit_amount > 60000 && +deposit_amount <= 70000 ){
                                const amount_to_deposit = (deposit_amount - 600) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  ); 

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }else if( +deposit_amount > 70000 && +deposit_amount <= 80000) {
                                const amount_to_deposit = (deposit_amount - 700) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  ); 

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }else if( +deposit_amount > 80000 && +deposit_amount <= 90000 ){
                                const amount_to_deposit = (deposit_amount - 750) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })
                               }else if( +deposit_amount > 90000 && +deposit_amount <= 100000 ){
                                const amount_to_deposit = (deposit_amount - 900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })

                               }else if( +deposit_amount > 100000 && +deposit_amount <= 200000 ){
                                const amount_to_deposit = (deposit_amount - 970) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   
                                
                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  })                              

                               }else if( +deposit_amount > 200000 && +deposit_amount <= 300000 ){
                                const amount_to_deposit = (deposit_amount - 1900) + find_user_wallet_balance

                               await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 

                               }else if( +deposit_amount > 300000 && +deposit_amount <= 400000 ){

                                const amount_to_deposit = (deposit_amount - 2900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }else if( +deposit_amount > 400000 && +deposit_amount <= 500000 ){

                                const amount_to_deposit = (deposit_amount - 3900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }else if( +deposit_amount > 500000 && +deposit_amount <= 600000 ){
                                const amount_to_deposit = (deposit_amount - 4900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }else if( +deposit_amount > 600000 && +deposit_amount <= 700000 ){

                                const amount_to_deposit = (deposit_amount - 5900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }else if( +deposit_amount > 700000 && +deposit_amount <= 800000 ){
                                const amount_to_deposit = (deposit_amount - 6900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   
                    

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }else if( +deposit_amount > 800000 && +deposit_amount <= 900000 ){
                                const amount_to_deposit = (deposit_amount - 7900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   
                    
                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }
                               else if(+deposit_amount > 900000 && +deposit_amount <= 1000000 ){
                                const amount_to_deposit = (deposit_amount - 8900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   
                    
                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }
                               else if(+deposit_amount > 1000000 && +deposit_amount <= 2000000 ){
                                const amount_to_deposit = (deposit_amount - 9900) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   
                    
                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }
                               else{

                                const amount_to_deposit = (deposit_amount - 12000) + find_user_wallet_balance

                                await Client_Wallet.update({ wallet_balance: amount_to_deposit }, 
                                    {
                                      where: {
                                        phoneNumber: find_user_phoneNumber,
                                      },
                                    }
                                  );   

                                  const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                    
                                  return res.status(200).json({
                                    message: `Deposit Successful!`,
                                    final_processing: "onabill781"
                                  }) 
                               }

                            }else if(valid_status === "processing"){

                              if (
                                getting_specific_transactions.dataValues.status ===
                                "processing"
                              ) {
                                return res.status(400).json({
                                  message: `This transaction has already processing by an admin.`,
                                });
                              }

                                const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });
                            
                                  return res.status(200).json({
                                    message: `Transaction status updated.`
                                  })

                            }else if(valid_status === "failed"){

                              if (
                                getting_specific_transactions.dataValues.status ===
                                "failed"
                              ) {
                                return res.status(400).json({
                                  message: `This transaction has already been marked as failed.`,
                                });
                              }

                                const updating_user_transactions: any = await Deposit_Transactions.update({status:valid_status},{
                                    where: {
                                      [Op.and]: [
                                        { tnx_id: valid_tnx_id },
                                        { user_id: find_user_id },
                                      ],
                                    },
                                  });

                                  return res.status(200).json({
                                    message: `Transaction status updated.`
                                  })
                            }
                            }else{
                                return res.status(400).json({
                                    message: `Cannot find this customer information.`
                                })                  
                            }

                          }else{
                            return res.status(400).json({
                              message: `This transaction has already been processed.`
                            })    
                          }

                        }else{
                            return res.status(404).json({
                                message: `Cannot find this transaction.`
                            })
                        }

                    }else{
                        return res.status(400).json({
                            message: `You are not authorized to make this transaction.`,
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
        console.error("Error processing deposit payment", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}