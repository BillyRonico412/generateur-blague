"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodEnv = void 0;
const zod_1 = require("zod");
exports.zodEnv = zod_1.z.object({
    PORT: zod_1.z.string(),
    API_KEY: zod_1.z.string(),
    PASSWORD: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
});
