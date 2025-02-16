import type { Metadata } from "next";
import Header from "../components/Header";
import "@repo/ui/index.css";

export const metadata: Metadata = {
  title: "Turbo Auth",
  description: "Turbo Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='dark'>
        <Header />
        {children}
      </body>
    </html>
  );
}
