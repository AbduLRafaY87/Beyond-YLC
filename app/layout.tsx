import ClientLayout from './components/ClientLayout'
import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Beyond YLC - Connect, Collaborate, Create</title>
        <meta name="description" content="Join Beyond YLC to connect with passionate individuals, collaborate on meaningful projects, and create positive change in your community." />
        <meta name="keywords" content="community, collaboration, projects, social impact, networking" />
        <meta name="author" content="Beyond YLC" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Beyond YLC - Connect, Collaborate, Create" />
        <meta property="og:description" content="Join Beyond YLC to connect with passionate individuals, collaborate on meaningful projects, and create positive change in your community." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Beyond YLC - Connect, Collaborate, Create" />
        <meta property="twitter:description" content="Join Beyond YLC to connect with passionate individuals, collaborate on meaningful projects, and create positive change in your community." />
        <meta property="twitter:image" content="/og-image.png" />

        {/* Favicon */}
        <link rel="icon" type="image" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={poppins.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
