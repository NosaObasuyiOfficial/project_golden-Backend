import {DataTypes, Model} from 'sequelize'
import { db } from '../database_connection/db_connect'


export type SIGNUP = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    password: string,
    account_type: string,
    referral_id: string,
    service_status:boolean
    block:boolean,
}

class Onabill_Admin_Signup extends Model<SIGNUP>{}

Onabill_Admin_Signup.init({
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type: DataTypes.BIGINT,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    account_type:{
        type: DataTypes.STRING,
        allowNull:false
    },
    referral_id:{
        type: DataTypes.STRING,
        allowNull:true
    },
    service_status:{
        type: DataTypes.BOOLEAN,
        allowNull:false
    },
    block:{
        type: DataTypes.BOOLEAN,
        allowNull:false
    }
}, {
    sequelize:db,
    tableName: "Onabill_Admin_Signup",
    modelName: "Onabill_Admin_Signup"
})

export default Onabill_Admin_Signup






