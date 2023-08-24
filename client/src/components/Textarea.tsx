interface Props {
	title: string;
	value: string;
	setValue: (value: string) => void;
	placeholder: string;
	maxLength: number;
}

const Textarea = (props: Props) => {
	return (
		<div>
			<label>
				<div className="flex items-center">
					<p>{props.title}</p>
					<p className="ml-auto text-xs">
						{props.value.length} / {props.maxLength}
					</p>
				</div>
				<textarea
					className="w-full px-4 py-2 rounded text-gray-700"
					value={props.value}
					onInput={(e) => {
						props.setValue(e.currentTarget.value);
					}}
					placeholder={props.placeholder}
					maxLength={props.maxLength}
				/>
			</label>
		</div>
	);
};

export default Textarea;
