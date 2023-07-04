import { useMachine } from "@xstate/react"
import ConnectedError from "../components/state/ConnectedError"
import ConnectedIdle from "../components/state/ConnectedIdle"
import ConnectedLoading from "../components/state/ConnectedLoading"
import ConnectedResult from "../components/state/ConnectedResult"
import Disconnected from "../components/state/Disconnected"
import { machine } from "../utils/state"
import { useEffect } from "react"

const Index = () => {
	const [state, send] = useMachine(machine)
	useEffect(() => {
		send({
			type: "CONNECT_BY_TOKEN",
		})
	}, [])
	return (
		<div className="w-screen h-screen bg-teal-600 text-white flex flex-col">
			<div className="container mx-auto px-4 py-8 flex flex-col my-auto gap-y-8">
				{(state.matches("disconnected") || state.matches("connecting")) && (
					<Disconnected
						connecting={state.matches("connecting")}
						onClickConnect={(password) => {
							send({
								type: "CONNECT_BY_PASSWORD",
								password,
							})
						}}
					/>
				)}
				{state.matches("connected.idle") && (
					<ConnectedIdle
						onClickGenerate={(context) => {
							send({
								type: "GET_JOKE",
								context,
							})
						}}
						onClickDisconnect={() => {
							send({
								type: "DISCONNECT",
							})
						}}
					/>
				)}
				{state.matches("connected.gettingJoke") && <ConnectedLoading />}
				{state.matches("connected.error") && <ConnectedError />}
				{state.matches("connected.result") && state.context.result && (
					<ConnectedResult
						result={state.context.result}
						onClickUneAutre={() => {
							send({
								type: "OTHER",
							})
						}}
						onClickNouvelleBlague={() => {
							send({
								type: "RESET",
							})
						}}
					/>
				)}
			</div>
		</div>
	)
}

export default Index
