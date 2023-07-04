import React, { useState } from "react"
import InputText from "../InputText"
import { RouterInputs } from "../../utils/trpc"

interface Props {
	onClickGenerate: (context: RouterInputs["joke"]) => void
	onClickDisconnect: () => void
}

const ConnectedIdle = (props: Props) => {
	const [lieu, setLieu] = useState("")
	const [natureDeLaRelation, setNatureDeLaRelation] = useState("")
	const [objectif, setObjectif] = useState("")
	const [ton, setTon] = useState("")
	const [pointCommun, setPointCommun] = useState("")
	const [difference, setDifference] = useState("")
	const [plusDeDetails, setPlusDeDetails] = useState("")
	return (
		<>
			<p className="text-3xl text-center font-bold">Generateur de blague</p>
			<div className="flex flex-col gap-y-4">
				<InputText
					title="Lieu"
					value={lieu}
					setValue={setLieu}
					placeholder='Ex: "a la piscine", "dans un bar", "au travail"'
					maxLength={100}
				/>
				<InputText
					title="Nature de la relation"
					value={natureDeLaRelation}
					setValue={setNatureDeLaRelation}
					placeholder='Ex: "entre amis", "entre collegues", "entre amoureux"'
					maxLength={100}
				/>
				<InputText
					title="Objectif"
					value={objectif}
					setValue={setObjectif}
					placeholder='Ex: "pour draguer", "pour se moquer", "pour faire rire"'
					maxLength={100}
				/>
				<InputText
					title="Ton"
					value={ton}
					setValue={setTon}
					placeholder='Ex: "drole", "absurde", "noir"'
					maxLength={100}
				/>
				<InputText
					title="Point commun"
					value={pointCommun}
					setValue={setPointCommun}
					placeholder='Ex: "on est tous les deux blonds", "on est tous les deux francais", "on est tous les deux fans de foot"'
					maxLength={100}
				/>
				<InputText
					title="Difference"
					value={difference}
					setValue={setDifference}
					placeholder='Ex: "il est riche et moi pauvre", "il est beau et moi moche", "il est intelligent et moi bete"'
					maxLength={100}
				/>
				<InputText
					title="Plus de detail"
					value={plusDeDetails}
					setValue={setPlusDeDetails}
					placeholder='Ex: "il est riche et moi pauvre", "il est beau et moi moche", "il est intelligent et moi bete"'
					maxLength={100}
				/>
			</div>
			<div className="flex flex-col gap-y-4">
				<button
					type="button"
					className="btn w-[300px] mx-auto"
					onClick={() => {
						props.onClickGenerate({
							lieu,
							natureDeLaRelation,
							objectif,
							ton,
							pointCommun,
							difference,
							plusDeDetails,
						})
					}}
				>
					Generer
				</button>
				<button
					type="button"
					className="btn w-[300px] mx-auto"
					onClick={() => {
						props.onClickDisconnect()
					}}
				>
					Deconnexion
				</button>
			</div>
		</>
	)
}

export default ConnectedIdle
