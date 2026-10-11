import "./globals.css";

export const metadata = {
  title: "Katalog — Softdev Store",
  description: "Katalog pilihan dari Softdev Store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
