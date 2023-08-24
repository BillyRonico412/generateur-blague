import { useState } from "react";
import { RouterInputs } from "../../utils/trpc";
import InputText from "../InputText";
import Textarea from "../Textarea";

interface Props {
	onClickGenerate: (context: RouterInputs["joke"]) => void;
	onClickDisconnect: () => void;
}

const ConnectedIdle = (props: Props) => {
	const [context, setContext] = useState("");
	return (
		<>
			<p className="text-3xl text-center font-bold">Generateur de blague</p>
			<div className="flex flex-col gap-y-4">
				<Textarea
					title="Contexte"
					value={context}
					setValue={setContext}
					placeholder='Ex: "Faire rire une jolie fille dans un bar"'
					maxLength={100}
				/>
			</div>
			<div className="flex flex-col gap-y-4">
				<button
					type="button"
					className="btn w-[300px] mx-auto"
					onClick={() => {
						props.onClickGenerate(context);
					}}
				>
					Generer
				</button>
				<button
					type="button"
					className="btn w-[300px] mx-auto"
					onClick={() => {
						props.onClickDisconnect();
					}}
				>
					Deconnexion
				</button>
			</div>
		</>
	);
};

export default ConnectedIdle;
