import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Personal Website',
  description: 'A personal website with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
