export default function Navbar() {
	return (
		<header className="fixed top-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-6 shadow-sm">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
						<svg
							className="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<span className="text-xl font-extrabold tracking-tight text-slate-800 ml-1">
						Broiler<span className="text-blue-600">Count</span>
					</span>
				</div>
			</div>
		</header>
	);
}
