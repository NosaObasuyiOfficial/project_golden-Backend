import {DataTypes, Model} from 'sequelize'
import { db } from '../database_connection/db_connect'


export type WALLET = {
    id: string,
    phoneNumber: number,
    wallet_balance: number
}

class Client_Wallet extends Model<WALLET>{}

Client_Wallet.init({
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.BIGINT,
        allowNull:false,
    },
    wallet_balance:{
        type: DataTypes.FLOAT,
        allowNull:false
    }
}, {
    sequelize:db,
    tableName: "Client_Wallet",
    modelName: "Client_Wallet"
})

export default Client_Wallet 






