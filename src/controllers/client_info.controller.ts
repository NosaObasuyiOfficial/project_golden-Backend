import {Request, Response} from 'express'
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
import Onabill_Signup, { SIGNUP } from '../db_model/signup.model'
import Client_Wallet, { WALLET } from '../db_model/client_wallet.model'

dotenv.config()
const { APP_SECRET } = process.env

export const get_customer_info = async(req:Request, res:Response) =>{
try{

    const token: any = req.headers.authorization;

    if(token){
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, APP_SECRET!);

        const customer_id = decodedToken.id

        const getting_customer_data = await Onabill_Signup.findOne({
            where: {
                id:customer_id
            }
        })
        if(getting_customer_data?.dataValues){

            if(getting_customer_data.dataValues.account_type !== "onabill_admin_101"){

            const client_wallet = await Client_Wallet.findOne({
                where:{
                    phoneNumber: getting_customer_data.dataValues.phoneNumber
                }
            })

            const client_firstName = getting_customer_data.dataValues.firstName

            if(Number(client_wallet?.dataValues.wallet_balance) === client_wallet?.dataValues.wallet_balance && client_wallet?.dataValues.wallet_balance % 1 !== 0){
                const client_wallet_balance = client_wallet?.dataValues.wallet_balance
            }
                const client_wallet_balance = `${client_wallet?.dataValues.wallet_balance}.00`

            const info = {
                firstName : client_firstName,
                wallet_balance: client_wallet_balance
            }

            return res.status(200).json({
                data: info
            })
            }else{
                const client_firstName = getting_customer_data.dataValues.firstName
                return res.status(200).json({
                    data: client_firstName
                })
            }

        }else{
            return res.status(400).json({
                message: `You are not a registered user.`
            })
        }

    }else{
        return res.status(500).json({
            message: `Set Token in the local storage`
        })
    }

}catch(error){
    console.error("Error getting customer info:", error);
    return res.status(500).json({ error: "Internal server error" });
}
}
