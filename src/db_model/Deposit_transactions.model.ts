import {DataTypes, Model} from 'sequelize'
import { db } from '../database_connection/db_connect'


export type TRANSACTION = {
    id:string,
    user_id:string,
    date: string,
    tnx_id: string,
    type:string,
    amount: number,
    status: "pending" | "processing" | "success" | "failed",
    state:boolean
}

class Deposit_Transactions extends Model<TRANSACTION>{}

Deposit_Transactions.init({
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
    tableName: "Deposit_Transactions",
    modelName: "Deposit_Transactions"
})

export default Deposit_Transactions






