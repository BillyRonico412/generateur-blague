import { DoneInvokeEvent, assign, createMachine } from "xstate";
import { RouterInputs, RouterOutputs, trpc } from "./trpc";

interface Context {
	context?: RouterInputs["joke"];
	result?: string;
	password?: string;
	token?: string;
}

type Event =
	| {
			type: "CONNECT_BY_PASSWORD";
			password: string;
	  }
	| {
			type: "DISCONNECT";
	  }
	| {
			type: "GET_JOKE";
			context: RouterInputs["joke"];
	  }
	| {
			type: "CONNECT_BY_TOKEN";
	  }
	| {
			type: "RESET";
	  }
	| {
			type: "OTHER";
	  };

export const machine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgDoJtZ0B7XfdAF0gGIBhAeQDkWBRBgFQG0AGALqJQABzKxs1bBWEgAHogAsfAJwEAjOoDMKxVq0A2PgYBMZgDQgAnogC0JleoIBWB+pMAOAOweTB0x6KAL5BlmhYeITklGA0eFB0EBSEeABuZADWhOE4+ATRVFK4UAhpZOioUhT8AjWyYhJVuLIKCOpqzs7qfHyKZl69HgZaXpY2CLbqil4EXlpDfJ0mhiYDWiFhGLlRFIXxdGAATodkhwQiADaVAGanyAQ5kfm7sUUlZRVNNXVIIA2S0mav1aJj4BDMnh8Hk68066lG1js8zU6mcWj4Wk8Wimzi8zg2IEeeQKr3oABEAJIAZWYbE4vEE9XEAJkwKR7gIfA88JUJlR8O6CPG9mhBEUim68Ocig8Hn0UwJRJ2MRokAI2AgFzAdAA4uwuAB9ABSTAA0uwfqJmU0WogTIoXCoenMhuK-M4uWNENoPBovH4fF0-Ni5oqtk8SaqIAQYNQ3kbMtqknkylkHuHiS8ozGwHH4gmsqVcOlPoDvozfv8bWyJj7Zophp4zNMvAZnF6EMswe0hl5tHoRoEwxFMyraNHY-HEwdjqdzldqLdDvclc8x2rJ-nE0WS5Uy4JLX9rYDbZ2+E4+F5xWjm15W+3EZ3XARea5MV5HINtMPtmvCmrDjgABXC5qDoAAldgqX1Q8qxPGt7F0AgAgMPs71cZYH3GKYZj6N9Vk-GVv1CQkM2Vf9o0A2AQLApguAACXYcDYOPVlQFaSY+U5PQ+VWf1ZQbRQOy0TpkIbPl1G8TxlDxH8IyzccCCOE5DggqCYIrK1Gng9jEB0NQB18Xx7TvNsOxwsUTHwj9uiI9YCVwMgIDgWQlSZbS2PkJEnWQzxUPhPEzBEjtbDRDphkMK8VGiySvDkvJiFIBTIHclkgV0toHSdKy5j5RQVFQ5wPBUELFGfYx9H8LRlAMBsVHxEjV0jN5UurDKDLbS9pmlHDTBMELVhMF9vFlXEHD7aV4vI0kIFanSvImaqhpQtDAswjswVcdp6pUHxtDmfR7M2EdpuzDUtTmzzWmxF8CsxZxorlSSyqEx9ZU5PldqMBZUOWKa-xmnM82KAswEu9KFo6j1A3cPloV8YTMQ0BsAu8GqzH+5qAOA0DwdPRDlr8g7AnUAw5Ve8YrKcPC+S6FQRmmI7SJOgHs2U048ZrHQhqvRtjJbMzHypyzrMI7l7JCIA */
	id: "machine",
	predictableActionArguments: true,
	schema: {
		context: {} as Context,
		events: {} as Event,
	},
	tsTypes: {} as import("./state.typegen").Typegen0,
	initial: "disconnected",
	states: {
		disconnected: {
			on: {
				CONNECT_BY_PASSWORD: {
					target: "connecting",
					actions: assign({
						password: (_, event) => event.password,
					}),
				},
				CONNECT_BY_TOKEN: {
					target: "connecting",
				},
			},
		},
		connecting: {
			invoke: {
				src: async (context) => {
					const token = localStorage.getItem("token");
					if (token) {
						const loginByToken = await trpc.loginByToken.mutate(token);
						if (!loginByToken) {
							throw new Error("Invalid token");
						}
						return token;
					}
					if (context.password) {
						return await trpc.loginByPassword.mutate(context.password);
					}
					throw new Error("No password");
				},
				onDone: {
					target: "connected",
					actions: [
						(
							_,
							event: DoneInvokeEvent<RouterOutputs["loginByPassword"] | string>,
						) => {
							if (typeof event.data === "boolean") {
								return;
							}
							localStorage.setItem("token", event.data);
						},
						assign({
							password: undefined,
						}),
					],
				},
				onError: {
					target: "disconnected",
					actions: assign({
						password: undefined,
					}),
				},
			},
		},
		connected: {
			on: {
				DISCONNECT: {
					target: "disconnected",
					actions: [
						() => localStorage.removeItem("token"),
						assign({
							password: undefined,
						}),
					],
				},
			},
			initial: "idle",
			states: {
				idle: {
					on: {
						GET_JOKE: {
							target: "gettingJoke",
							actions: assign({
								context: (_, event) => event.context,
							}),
						},
					},
				},
				gettingJoke: {
					invoke: {
						src: async (context) => {
							if (!context.context) throw new Error("No context");
							return await trpc.joke.query(context.context);
						},
						onDone: {
							actions: assign({
								result: (_, event: DoneInvokeEvent<RouterOutputs["joke"]>) => {
									return event.data;
								},
							}),
							target: "result",
						},
						onError: {
							target: "error",
						},
					},
				},
				result: {
					on: {
						RESET: {
							target: "idle",
							actions: assign({
								context: () => undefined,
								result: () => undefined,
							}),
						},
						OTHER: {
							target: "gettingJoke",
						},
					},
				},
				error: {
					on: {
						RESET: {
							target: "idle",
							actions: assign({
								context: () => undefined,
								result: () => undefined,
							}),
						},
					},
				},
			},
		},
	},
});
