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
exports.createContext = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const interface_1 = require("./interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const env = interface_1.zodEnv.parse(process.env);
const createContext = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return {
            isConnected: false,
        };
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        jsonwebtoken_1.default.verify(token, env.JWT_SECRET);
        return {
            isConnected: true,
        };
    }
    catch (_a) {
        return {
            isConnected: false,
        };
    }
});
exports.createContext = createContext;
