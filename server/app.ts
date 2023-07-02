import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import z from "zod"
import { zodEnv } from "./interface"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const appRouter = router({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return { message: `Hello ${input}!` }
	}),
})

const server = createHTTPServer({
	middleware: cors(),
	router: appRouter,
})

const env = zodEnv.parse(process.env)

server.listen(Number(env.PORT))

export type AppRouter = typeof appRouter
