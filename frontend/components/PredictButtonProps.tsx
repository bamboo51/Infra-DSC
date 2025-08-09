interface PredictButtonProps {
	onClick: () => void;
	isLoading: boolean;
	disabled: boolean;
}

export const PredictButton: React.FC<PredictButtonProps> = ({ onClick, isLoading, disabled }) => (
	<button
		onClick={onClick}
		disabled={isLoading || disabled}
		className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
	>
		{isLoading ? "Loading..." : "Predict"}
	</button>
);