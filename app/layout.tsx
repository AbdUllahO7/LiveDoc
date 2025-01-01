import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google"



export const metadata: Metadata = {
  title: 'LiveDocs',
  description: 'Your go-to collaborative editor',
}


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={cn( "min-h-screen font-sans antialiased" , fontSans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
