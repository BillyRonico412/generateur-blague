import { z } from "zod"

export const zodEnv = z.object({
	PORT: z.string(),
})
