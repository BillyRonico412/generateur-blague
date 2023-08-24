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
const standalone_1 = require("@trpc/server/adapters/standalone");
const await_to_js_1 = __importDefault(require("await-to-js"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const zod_1 = __importDefault(require("zod"));
const interface_1 = require("./interface");
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const context_1 = require("./context");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
console.log("Starting server...");
dotenv_1.default.config();
const env = interface_1.zodEnv.parse(process.env);
const openAIConfig = new openai_1.Configuration({
    apiKey: env.API_KEY,
});
const openAI = new openai_1.OpenAIApi(openAIConfig);
const generateJoke = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [err, response] = yield (0, await_to_js_1.default)(openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Tu es un humoriste qui propose des blagues très drôles. Les utilisateurs vont te demander de generer des blagues en fonction d'un contexte. Tu devrais faire un sorte que la blague ne soit pas trop longue et corresponde aux critères demandés. Ils comptent sur toi pour impressionner et faire rire leurs interlocuteurs. (PS: Tu ne fais pas la discussion, tu génère juste une blague et t'écris rien d'autre, et surtout les blagues doivent être tiré que de la langue française, pas de traduction)",
            },
            {
                role: "user",
                content: JSON.stringify(context),
            },
        ],
    }));
    if (err !== null) {
        const error = err;
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        }
        else {
            console.log(err.message);
        }
        return undefined;
    }
    return (_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
});
const appRouter = (0, trpc_1.router)({
    loginByToken: trpc_1.publicProcedure
        .input(zod_1.default.string())
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            jsonwebtoken_1.default.verify(input, env.JWT_SECRET);
            return true;
        }
        catch (_b) {
            return false;
        }
    })),
    loginByPassword: trpc_1.publicProcedure
        .input(zod_1.default.string())
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        if (input !== env.PASSWORD) {
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to use this API",
            });
        }
        const token = jsonwebtoken_1.default.sign({}, env.JWT_SECRET);
        return token;
    })),
    joke: trpc_1.publicProcedure
        .input(zod_1.default.string().max(100))
        .query(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.isConnected) {
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to use this API",
            });
        }
        const [err, joke] = yield (0, await_to_js_1.default)(generateJoke(input));
        if (err !== null) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occured while generating the joke",
            });
        }
        if (joke === undefined) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occured while generating the joke",
            });
        }
        return joke;
    })),
});
const server = (0, standalone_1.createHTTPServer)({
    middleware: (0, cors_1.default)(),
    router: appRouter,
    createContext: context_1.createContext,
});
const listen = server.listen(Number(env.PORT));
console.log(`Listening on port ${listen.port}`);
