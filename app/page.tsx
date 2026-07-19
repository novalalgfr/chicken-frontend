import InputSection from './components/input-section';

export default function Home() {
	return (
		<div className="relative w-full min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
			{/* Efek Ambient statis yang sangat ringan (tanpa mix-blend) */}
			<div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
			<div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

			<div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28">
				{/* Hero Section */}
				<section className="flex flex-col items-center text-center space-y-6 mb-20">
					<div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
						{/* Titik indikator tanpa animasi pulse */}
						<span className="flex w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
						Powered by YOLOv11
					</div>

					<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
						Hitung Ayam Broiler <br className="hidden sm:block" />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400">
							Lebih Cerdas & Akurat
						</span>
					</h1>

					<p className="max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
						Sistem visi komputer untuk mendeteksi dan menghitung populasi ayam broiler secara real-time
						melalui gambar atau kamera perangkat Anda.
					</p>
				</section>

				{/* Placeholder Input (Tanpa hover yang berat, murni desain bersih) */}
				<section className="w-full max-w-3xl mx-auto">
					<InputSection />
				</section>
			</div>
		</div>
	);
}
