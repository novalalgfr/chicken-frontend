export default function Footer() {
	return (
		<footer className="w-full pb-8 pt-16 mt-auto bg-slate-50">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-white p-6 border border-slate-200 md:flex-row text-sm font-medium shadow-sm">
					<p className="text-slate-600">YOLOv11 Deep Learning.</p>
					<div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-500">
						<span>Skripsi</span>
						<span className="hidden sm:inline">•</span>
						<span>Universitas Gunadarma</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
