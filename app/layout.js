import './globals.css';

export const metadata = {
  title: 'Personal Expense Tracker',
  description: 'Track your daily expenses with Supabase + Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
/*
TESTING......
*/
