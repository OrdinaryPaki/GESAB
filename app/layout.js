import "./globals.css";

export const metadata = {
  title: "GESAB",
  description: "GESAB hemsida",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
