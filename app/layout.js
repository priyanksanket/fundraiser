import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Fundraiser',
    description: 'A platform to raise funds for what matters to you.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
