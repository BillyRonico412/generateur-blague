import { createHTTPServer } from "@trpc/server/adapters/standalone";
import to from "await-to-js";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import z from "zod";
import { zodEnv } from "./interface";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { createContext } from "./context";
import jwt from "jsonwebtoken";

console.log("Starting server...");

dotenv.config();

const env = zodEnv.parse(process.env);

const openAIConfig = new Configuration({
	apiKey: env.API_KEY,
});

const openAI = new OpenAIApi(openAIConfig);

const generateJoke = async (context: string): Promise<string | undefined> => {
	const [err, response] = await to(
		openAI.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"Tu es un humoriste qui propose des blagues très drôles. Les utilisateurs vont te demander de generer des blagues en fonction d'un contexte. Tu devrais faire un sorte que la blague ne soit pas trop longue et corresponde aux critères demandés. Ils comptent sur toi pour impressionner et faire rire leurs interlocuteurs. (PS: Tu ne fais pas la discussion, tu génère juste une blague et t'écris rien d'autre, et surtout les blagues doivent être tiré que de la langue française, pas de traduction)",
				},
				{
					role: "user",
					content: JSON.stringify(context),
				},
			],
		}),
	);
	if (err !== null) {
		const error = err as unknown as {
			response: {
				status: unknown;
				data: unknown;
			};
			message: unknown;
		};
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(err.message);
		}
		return undefined;
	}
	return response.data.choices[0].message?.content;
};

const appRouter = router({
	loginByToken: publicProcedure
		.input(z.string())
		.mutation(async ({ input }) => {
			try {
				jwt.verify(input, env.JWT_SECRET);
				return true;
			} catch {
				return false;
			}
		}),
	loginByPassword: publicProcedure
		.input(z.string())
		.mutation(async ({ input }) => {
			if (input !== env.PASSWORD) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to use this API",
				});
			}
			const token = jwt.sign({}, env.JWT_SECRET);
			return token;
		}),
	joke: publicProcedure
		.input(z.string().max(100))
		.query(async ({ input, ctx }) => {
			if (!ctx.isConnected) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to use this API",
				});
			}
			const [err, joke] = await to(generateJoke(input));
			if (err !== null) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "An error occured while generating the joke",
				});
			}
			if (joke === undefined) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "An error occured while generating the joke",
				});
			}
			return joke;
		}),
});

const server = createHTTPServer({
	middleware: cors(),
	router: appRouter,
	createContext,
});

const listen = server.listen(Number(env.PORT));

console.log(`Listening on port ${listen.port}`);

export type AppRouter = typeof appRouter;
