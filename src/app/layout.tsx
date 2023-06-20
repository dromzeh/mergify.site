'use client'

import '@/app/globals.css'
import { Nunito } from 'next/font/google'
import Footer from '@/components/Footer'
import { Session } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { SessionProvider } from 'next-auth/react'

const nunito = Nunito({ subsets: ['latin'] })

interface Props {
    session: Session | null
    children: React.ReactNode
    token: string | null
}

const RootLayout: React.FC<Props> = ({ children, session }) => {
    return (
        <html lang="en">
            <body className={nunito.className}>
                <SessionProvider session={session}>
                    <div>{children}</div>
                </SessionProvider>
                <Footer />
            </body>
        </html>
    )
}

export default RootLayout
