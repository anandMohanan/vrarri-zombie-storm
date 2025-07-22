import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryClientProvider } from '@/components/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'XR Center | Game Space',
    description: 'Player registration system for XR Center Game Space',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
            <ReactQueryClientProvider>
            {children}
            </ReactQueryClientProvider>
            
            </body>
        </html>
    );
}
