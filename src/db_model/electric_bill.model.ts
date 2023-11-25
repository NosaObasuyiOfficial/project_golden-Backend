import {DataTypes, Model} from 'sequelize'
import { db } from '../database_connection/db_connect'


export type BILL_TRANSACTION = {
    id:string,
    user_id:string,
    date: string,
    phoneNumber: number,
    tnx_id: string,
    type: string,
    amount: number,
    meter_details: string,
    status: "pending" | "processing" | "success" | "failed",
    state:boolean
}

class Electricity_Payment extends Model<BILL_TRANSACTION>{}

Electricity_Payment.init({
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    user_id:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    date:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    tnx_id:{
        type: DataTypes.UUID,
        allowNull:false
    },
    type:{
        type: DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type: DataTypes.BIGINT,
        allowNull:false
    },
    meter_details:{
        type: DataTypes.STRING,
        allowNull:false
    },
    status:{
        type: DataTypes.STRING,
        allowNull:false
    },
    state:{
        type: DataTypes.BOOLEAN,
        allowNull:false
    }
}, {
    sequelize:db,
    tableName: "Electricity_Payment",
    modelName: "Electricity_Payment"
})

export default Electricity_Payment
