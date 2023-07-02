import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../../../server/app"

export const trpc = createTRPCReact<AppRouter>()
