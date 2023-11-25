"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiDelete = exports.formDataPatch = exports.apiPatch = exports.formDataPut = exports.apiPut = exports.FormDataPost = exports.apiPost = exports.apiGet = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const baseUrl = "http://localhost:4040";
const apiGet = (path) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    };
    return axios_1.default.get(`${baseUrl}${path}`, config); // axios.get('http://localhost:4500/user/get-user', config)
};
exports.apiGet = apiGet;
const apiPost = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    };
    return yield axios_1.default.post(`${baseUrl}${path}`, data, config); // axios.post('http://localhost:4500/user/signup', formdata config)
});
exports.apiPost = apiPost;
const FormDataPost = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
        },
    };
    return yield axios_1.default.post(`${baseUrl}${path}`, data, config);
});
exports.FormDataPost = FormDataPost;
const apiPut = (path, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": ["application/json"]
        },
    };
    return axios_1.default.put(`${baseUrl}${path}`, data, config);
};
exports.apiPut = apiPut;
const formDataPut = (path, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        },
    };
    return axios_1.default.put(`${baseUrl}${path}`, data, config);
};
exports.formDataPut = formDataPut;
const apiPatch = (path, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": ["application/json"]
        },
    };
    return axios_1.default.patch(`${baseUrl}${path}`, data, config);
};
exports.apiPatch = apiPatch;
const formDataPatch = (path, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        },
    };
    return axios_1.default.patch(`${baseUrl}${path}`, data, config);
};
exports.formDataPatch = formDataPatch;
const apiDelete = (path) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    };
    return axios_1.default.delete(`${baseUrl}${path}`, config);
};
exports.apiDelete = apiDelete;
