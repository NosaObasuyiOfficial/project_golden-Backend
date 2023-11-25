import {DataTypes, Model} from 'sequelize'
import { db } from '../database_connection/db_connect'


export type METER = {
    id:string,
    user_id:string,
    phoneNumber: number,
    meter_name: string,
    meter_number: string,
    meter_type: string,
    state: string
}

class Client_Meter_Details extends Model<METER>{}


Client_Meter_Details.init({
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    user_id:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    phoneNumber:{
        type: DataTypes.BIGINT,
        allowNull:false,
    },
    meter_name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    meter_number:{
        type: DataTypes.STRING,
        allowNull:false
    },
    meter_type:{
        type: DataTypes.STRING,
        allowNull:false
    },
    state:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, {
    sequelize:db,
    tableName: "Client_Meter_Details",
    modelName: "Client_Meter_Details"
})

export default Client_Meter_Details















