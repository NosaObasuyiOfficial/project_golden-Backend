import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv  from "dotenv";

dotenv.config()

const { APP_SECRET } = process.env

export const hashedPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };  


export const tokenGenerator = (new_user_id:any)=>{
  const expiresIn = '1d'

    const token = jwt.sign(new_user_id, APP_SECRET!, { expiresIn })
    return token
  }