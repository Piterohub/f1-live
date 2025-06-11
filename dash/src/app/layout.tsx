import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env";
import EnvScript from "@/env-script";
import OledModeProvider from "@/components/OledModeProvider";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

type Props = Readonly<{
	children: ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en" className="bg-[#0a0a0a] text-white" style={{ fontFamily: "'Urbanist', sans-serif" }}>
			<head>
				<EnvScript />

				{/* Google Fonts - Urbanist */}
				<link
					href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>

				{env.DISABLE_IFRAME === "1" && (
					<Script strategy="beforeInteractive" id="no-embed">
						{`if (window.self !== window.top && window.location.pathname !== "/embed") {window.location.href = "/embed"; }`}
					</Script>
				)}

				{env.TRACKING_ID && env.TRACKING_URL && (
					// Umami Analytics
					<Script async defer data-website-id={env.TRACKING_ID} src={env.TRACKING_URL} />
				)}
			</head>

			<body className="bg-[#0a0a0a] text-white">
				<header className="w-full flex justify-end items-center p-4 border-b border-[#c9a95d]">
					<a href="https://www.formulacritica.it" target="_blank" rel="noopener noreferrer">
						<img src="/logo-formulacritica.webp" alt="FormulaCritica Logo" className="h-10 w-auto" />
					</a>
				</header>
				<OledModeProvider>{children}</OledModeProvider>
			</body>
		</html>
	);
}
