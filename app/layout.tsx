import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";



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
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: { colorPrimary : '#3371ff' , fontSize : '16px'},
    }}>
        <html lang="en">
        <body
          className={cn( "min-h-screen font-sans antialiased" , fontSans.variable)}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
