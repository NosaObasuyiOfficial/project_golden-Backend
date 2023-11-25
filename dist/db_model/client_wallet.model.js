"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connect_1 = require("../database_connection/db_connect");
class Client_Wallet extends sequelize_1.Model {
}
Client_Wallet.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    wallet_balance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: db_connect_1.db,
    tableName: "Client_Wallet",
    modelName: "Client_Wallet"
});
exports.default = Client_Wallet;
