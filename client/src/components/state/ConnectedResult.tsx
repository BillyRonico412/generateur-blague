interface Props {
	result: string
	onClickUneAutre: () => void
	onClickNouvelleBlague: () => void
}

const ConnectedResult = (props: Props) => {
	return (
		<>
			<p className="text-center">{props.result}</p>
			<div className="flex gap-x-4">
				<button
					type="button"
					className="btn w-[300px] ml-auto"
					onClick={() => {
						props.onClickUneAutre()
					}}
				>
					Une autre
				</button>
				<button
					type="button"
					className="btn w-[300px] mr-auto"
					onClick={() => {
						props.onClickNouvelleBlague()
					}}
				>
					Nouvelle blague
				</button>
			</div>
		</>
	)
}

export default ConnectedResult
