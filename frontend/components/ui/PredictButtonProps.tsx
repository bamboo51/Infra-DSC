interface PredictButtonProps {
	onClick: () => void;
	isLoading: boolean;
	disabled: boolean;
}

export const PredictButton: React.FC<PredictButtonProps> = ({ onClick, isLoading, disabled }) => (
	<button
		onClick={onClick}
		disabled={isLoading || disabled}
		className={`
			group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl
			transition-all duration-300 transform shadow-lg
			${isLoading || disabled 
				? 'bg-gray-300 cursor-not-allowed opacity-50 text-gray-500' 
				: 'bg-black hover:bg-gray-800 hover:scale-105 hover:shadow-xl text-white'
			}
			border border-transparent
		`}
	>
		{isLoading && (
			<svg 
				className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
				xmlns="http://www.w3.org/2000/svg" 
				fill="none" 
				viewBox="0 0 24 24"
			>
				<circle 
					className="opacity-25" 
					cx="12" 
					cy="12" 
					r="10" 
					stroke="currentColor" 
					strokeWidth="4"
				></circle>
				<path 
					className="opacity-75" 
					fill="currentColor" 
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		)}
		{!isLoading && (
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" 
				fill="none" 
				viewBox="0 0 24 24" 
				stroke="currentColor"
			>
				<path 
					strokeLinecap="round" 
					strokeLinejoin="round" 
					strokeWidth={2} 
					d="M13 10V3L4 14h7v7l9-11h-7z" 
				/>
			</svg>
		)}
		<span className="relative">
			{isLoading ? "検出中..." : "検出開始"}
		</span>
	</button>
);