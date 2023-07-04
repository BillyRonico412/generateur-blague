import { useState } from "react"
import InputText from "../InputText"

interface Props {
	connecting: boolean
	onClickConnect: (password: string) => void
}

const Disconnected = (props: Props) => {
	const [password, setPassword] = useState("")
	return (
		<>
			<p className="text-3xl text-center font-bold">Generateur de blague</p>
			<InputText
				title="Mot de passe"
				value={password}
				setValue={setPassword}
				placeholder='Ex: "1234"'
				maxLength={100}
				isPassword={true}
			/>
			<button
				type="button"
				className="btn"
				disabled={props.connecting}
				onClick={() => {
					props.onClickConnect(password)
				}}
			>
				{props.connecting ? "Connexion..." : "Se connecter"}
			</button>
		</>
	)
}

export default Disconnected
