import { FiltersProvider } from "@/context/FiltersContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FiltersProvider>{children}</FiltersProvider>
      </body>
    </html>
  );
}
