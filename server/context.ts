import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone"
import dotenv from "dotenv"
import { zodEnv } from "./interface"
import jwt from "jsonwebtoken"
import { inferAsyncReturnType } from "@trpc/server"

dotenv.config()
const env = zodEnv.parse(process.env)

export const createContext = async ({ req }: CreateHTTPContextOptions) => {
	if (!req.headers.authorization) {
		return {
			isConnected: false,
		}
	}
	const token = req.headers.authorization.split(" ")[1]
	try {
		jwt.verify(token, env.JWT_SECRET)
		return {
			isConnected: true,
		}
	} catch {
		return {
			isConnected: false,
		}
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
