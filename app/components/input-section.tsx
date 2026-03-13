/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function InputSection() {
	const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// State untuk menyimpan hasil dari API Flask
	const [detectionResult, setDetectionResult] = useState<{ count: number; image_base64: string } | null>(null);

	// State untuk Kamera
	const [isCameraOn, setIsCameraOn] = useState(false);
	const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// --- LOGIKA UPLOAD GAMBAR ---
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrorMsg(null);
		const file = e.target.files?.[0];

		if (!file) return;

		if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
			setErrorMsg('Format file harus JPG atau PNG.');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setErrorMsg('Ukuran gambar maksimal 5MB.');
			return;
		}

		setSelectedFile(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// --- LOGIKA KAMERA ---
	const stopCamera = useCallback(() => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			setIsCameraOn(false);
		}
	}, []);

	const startCamera = useCallback(async () => {
		setErrorMsg(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: facingMode }
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setIsCameraOn(true);
			}
		} catch (err) {
			setErrorMsg('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
		}
	}, [facingMode]);

	const flipCamera = () => {
		stopCamera();
		setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
	};

	const captureImage = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL('image/jpeg');
				setImagePreview(dataUrl);

				fetch(dataUrl)
					.then((res) => res.blob())
					.then((blob) => {
						const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
						setSelectedFile(file);
					});
				stopCamera();
			}
		}
	};

	// Efek Kamera
	useEffect(() => {
		if (activeTab === 'camera' && !imagePreview) {
			startCamera();
		} else {
			stopCamera();
		}
		return () => {
			stopCamera();
		};
	}, [activeTab, imagePreview, startCamera, stopCamera]);

	// --- LOGIKA KIRIM KE FLASK API ---
	const handleDetect = async () => {
		if (!selectedFile) return;

		setIsLoading(true);
		setErrorMsg(null);
		setDetectionResult(null); // Reset hasil sebelumnya

		const formData = new FormData();
		formData.append('image', selectedFile);

		try {
			const response = await fetch('http://localhost:5000/api/detect', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Gagal melakukan deteksi');

			const result = await response.json();

			// Simpan hasil ke state agar UI langsung berubah
			setDetectionResult({
				count: result.count,
				image_base64: result.image_base64
			});
		} catch (error) {
			setErrorMsg('Terjadi kesalahan saat menghubungi server API Flask.');
		} finally {
			setIsLoading(false);
		}
	};

	const resetImage = () => {
		setImagePreview(null);
		setSelectedFile(null);
		setDetectionResult(null); // Bersihkan juga hasil deteksi
		if (activeTab === 'camera') startCamera();
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<div className="w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
			{errorMsg && (
				<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
					{errorMsg}
				</div>
			)}

			{!imagePreview ? (
				<div className="flex flex-col space-y-6">
					<div className="flex bg-slate-100 p-1 rounded-xl">
						<button
							onClick={() => setActiveTab('upload')}
							className={`cursor-pointer flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
						>
							Upload Foto
						</button>
						<button
							onClick={() => setActiveTab('camera')}
							className={`cursor-pointer flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'camera' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
						>
							Kamera HP
						</button>
					</div>

					{activeTab === 'upload' && (
						<div
							onClick={() => fileInputRef.current?.click()}
							className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
						>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								accept="image/jpeg, image/png"
								className="hidden"
							/>
							<div className="flex flex-col items-center space-y-3">
								<div className="p-3 bg-white rounded-full shadow-sm">
									<svg
										className="w-8 h-8 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
										/>
									</svg>
								</div>
								<p className="text-slate-700 font-medium">Klik untuk memilih gambar</p>
								<p className="text-slate-500 text-sm">JPG atau PNG, maksimal 5MB</p>
							</div>
						</div>
					)}

					{activeTab === 'camera' && (
						<div className="flex flex-col items-center space-y-4">
							<div className="relative w-full max-w-md aspect-[3/4] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
								<video
									ref={videoRef}
									autoPlay
									playsInline
									className="w-full h-full object-cover"
								/>
								{isCameraOn && (
									<button
										onClick={flipCamera}
										className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
										title="Putar Kamera"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											/>
										</svg>
									</button>
								)}
							</div>
							<canvas
								ref={canvasRef}
								className="hidden"
							/>
							<button
								onClick={captureImage}
								className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								Ambil Foto
							</button>
						</div>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center space-y-6">
					{/* INFO JUMLAH AYAM TERDETEKSI */}
					{detectionResult && (
						<div className="w-full max-w-md bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center shadow-sm">
							<h4 className="text-lg font-bold text-teal-900 mb-1">Deteksi Selesai!</h4>
							<p className="text-teal-800 font-medium">
								Total ayam terdeteksi:{' '}
								<span className="text-3xl font-extrabold mx-2 text-teal-600">
									{detectionResult.count}
								</span>{' '}
								ekor
							</p>
						</div>
					)}

					<div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							// Tampilkan gambar hasil deteksi dari API, jika belum ada tampilkan gambar asli
							src={detectionResult ? detectionResult.image_base64 : (imagePreview as string)}
							alt="Preview Ayam"
							className="w-full h-auto object-contain max-h-[60vh]"
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
						<button
							onClick={resetImage}
							disabled={isLoading}
							className="cursor-pointer flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
						>
							{detectionResult ? 'Coba Gambar Lain' : 'Ganti Gambar'}
						</button>

						{/* Tombol Deteksi Hilang jika sudah ada hasil */}
						{!detectionResult && (
							<button
								onClick={handleDetect}
								disabled={isLoading}
								className="cursor-pointer flex-1 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
							>
								{isLoading ? (
									<>
										<svg
											className="animate-spin h-5 w-5 text-white"
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
										Mendeteksi...
									</>
								) : (
									<>Mulai Deteksi</>
								)}
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
