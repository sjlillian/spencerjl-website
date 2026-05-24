export const metadata = {
  title: "Spencer",
  description: "Personal website and portfolio"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}