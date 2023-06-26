import "./globals.css";
import { Inter } from "next/font/google";
import { AppContextProvider } from "./components/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`bg-white h-full w-full, ${inter.className}`}>
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
