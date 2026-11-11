import "./globals.css";

export const metadata = {
  title: "Sarkari Naukri",
  description: "Government jobs, results, and admit cards in one place."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
