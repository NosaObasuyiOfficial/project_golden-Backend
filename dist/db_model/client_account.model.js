"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connect_1 = require("../database_connection/db_connect");
class Client extends sequelize_1.Model {
}
Onabill_Signup.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    account_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    referral_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    service_status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    block: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: db_connect_1.db,
    tableName: "Onabill_Signup",
    modelName: "Onabill_Signup"
});
exports.default = Onabill_Signup;
