"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connect_1 = require("../database_connection/db_connect");
class Client_Meter_Details extends sequelize_1.Model {
}
Client_Meter_Details.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    meter_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    meter_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    meter_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db_connect_1.db,
    tableName: "Client_Meter_Details",
    modelName: "Client_Meter_Details"
});
exports.default = Client_Meter_Details;
