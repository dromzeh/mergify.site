import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import { scope } from '@/lib/spotify/scopes'

const handler = NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                params: { scope },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token = Object.assign({}, token, {
                    access_token: account.access_token,
                })
            }
            return token
        },
        async session({ session, token }) {
            if (session) {
                session = Object.assign({}, session, {
                    id: token.sub,
                    access_token: token.access_token,
                })
            }
            return session
        },
    },
})

export { handler as GET, handler as POST }
