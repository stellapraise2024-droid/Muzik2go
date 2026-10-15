import type { Metadata, Viewport } from 'next';
import './globals.css';
import SwRegister from '../components/SwRegister';

export const metadata: Metadata = {
  title: 'Muzik2Go — Your Studio, Anywhere',
  description: 'Practice, record, analyze and finish your music. Your studio, anywhere.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Muzik2Go' },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#121A26',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
