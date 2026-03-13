import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'BroilerCount | YOLOv11',
	description: 'Sistem Web Penghitung Jumlah Ayam Broiler Menggunakan Deep Learning YOLOv11'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="id"
			className="scroll-smooth"
		>
			{/* Mengganti warna background dasar menjadi lebih terang dan netral */}
			<body
				className={`${inter.className} bg-slate-50 antialiased selection:bg-blue-200 selection:text-blue-900`}
			>
				<div className="flex min-h-screen flex-col">
					<Navbar />
					<main className="flex-grow flex flex-col relative">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
