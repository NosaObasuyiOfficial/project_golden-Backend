"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_connect_1 = require("./database_connection/db_connect");
const signup_route_1 = __importDefault(require("./routes/signup.route"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const client_info_route_1 = __importDefault(require("./routes/client_info.route"));
const deposit_withdrawal_route_1 = __importDefault(require("./routes/deposit&withdrawal.route"));
const meter_route_1 = __importDefault(require("./routes/meter.route"));
const electric_bill_route_1 = __importDefault(require("./routes/electric_bill.route"));
const get_all_transactions_route_1 = __importDefault(require("./routes/get_all_transactions.route"));
const cors_1 = __importDefault(require("cors"));
/*--------env setup-----------*/
dotenv_1.default.config();
const { PORT } = process.env;
const app = (0, express_1.default)();
/*----------Middlewares-------------*/
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: false }));
/*------------Endpoints--------------*/
app.use('/', signup_route_1.default);
app.use('/', login_route_1.default);
app.use('/', client_info_route_1.default);
app.use('/', deposit_withdrawal_route_1.default);
app.use('/', meter_route_1.default);
app.use('/', electric_bill_route_1.default);
app.use('/', get_all_transactions_route_1.default);
/*----Checking Database Connection-------------*/
db_connect_1.db.sync()
    .then(() => {
    console.log("Database is connected SUCCESSFULLY");
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
