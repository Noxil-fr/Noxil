import { Barlow } from 'next/font/google'
import './globals.css'

const barlow = Barlow({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = { title: 'Noxil' }

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Anti-flicker : applique le thème avant hydratation */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('noxil-theme') === 'light')
              document.documentElement.classList.add('light');
          } catch {}
        `}} />
      </head>
      <body className={barlow.className}>{children}</body>
    </html>
  )
}
