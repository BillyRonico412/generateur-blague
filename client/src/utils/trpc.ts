import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "../../../server/app"

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: import.meta.env.VITE_API_URL,
			async headers() {
				const token = localStorage.getItem("token")
				if (token === null) {
					return {}
				}
				return {
					authorization: `Bearer ${token}`,
				}
			},
		}),
	],
})
