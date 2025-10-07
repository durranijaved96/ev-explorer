import "./globals.css";
import Providers from "./components/ThemeProvider";

export default function RootLayout({
  children,
  modal,            // ⬅️ add this
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;   // ⬅️ optional
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          {modal /* ⬅️ parallel route content (your modal) */}
        </Providers>
      </body>
    </html>
  );
}
