import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Civic Hero - Smart Governance Platform',
  description: 'Empowering citizens to build better cities. Report issues, track progress, and engage with your local administration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout-container">
          {children}
        </div>
      </body>
    </html>
  );
}
