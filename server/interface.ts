import { z } from "zod"

export const zodEnv = z.object({
	PORT: z.string(),
	API_KEY: z.string(),
	PASSWORD: z.string(),
	JWT_SECRET: z.string(),
})
