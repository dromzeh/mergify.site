'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { SpotifyProfile } from '@/components/SpotifyProfile'
import { PlaylistManager } from '@/components/PlaylistManager'
import type { Playlist } from '@/lib/spotify/types'
import Merge from '@/components/Merge'

export default function Home() {
    const [isMergeVisible, setIsMergeVisible] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')

    const { data: session, status } = useSession()
    console.log(session)

    const handleMergeClick = () => {
        setIsMergeVisible(true)
    }

    const handleCancelMerge = () => {
        setIsMergeVisible(false)
    }

    const handlePlaylistClick = (playlist: Playlist) => {
        const index = selectedPlaylists.indexOf(playlist.id)
        if (index === -1) {
            setSelectedPlaylists([...selectedPlaylists, playlist.id])
            setPlaylists((prevPlaylists) =>
                prevPlaylists.map((p) =>
                    p.id === playlist.id ? { ...p, selected: true } : p
                )
            )
        } else {
            setSelectedPlaylists([
                ...selectedPlaylists.slice(0, index),
                ...selectedPlaylists.slice(index + 1),
            ])
            setPlaylists((prevPlaylists) =>
                prevPlaylists.map((p) =>
                    p.id === playlist.id ? { ...p, selected: false } : p
                )
            )
        }
    }

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (status === 'authenticated') {
                const response = await fetch(
                    'https://api.spotify.com/v1/me/playlists?limit=50&offset=0',
                    {
                        headers: {
                            Authorization: `Bearer ${
                                session?.access_token ?? ''
                            }`,
                        },
                    }
                )
                const { items } = await response.json()
                setPlaylists(items)
            }
        }

        fetchPlaylists()
    }, [status, session?.access_token])

    const handleLogout = () => {
        signOut({
            callbackUrl: '/',
        })
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    return (
        <main className="min-h-screen p-12">
            {session ? (
                <>
                    {session.user && (
                        <SpotifyProfile
                            imageUrl={session.user.image as string}
                            userName={session.user.name as string}
                            onLogout={handleLogout}
                        />
                    )}
                    <PlaylistManager
                        playlists={playlists}
                        selectedPlaylists={selectedPlaylists}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        onPlaylistClick={handlePlaylistClick}
                        onMerge={() => handleMergeClick()}
                    />
                    {isMergeVisible && (
                        <Merge
                            session={session}
                            playlists={playlists}
                            selectedPlaylists={selectedPlaylists}
                            onCancel={handleCancelMerge}
                        />
                    )}{' '}
                    {/* Conditional rendering */}
                </>
            ) : (
                <div className="flex min-h-screen flex-col items-center justify-center">
                    <div className="text-sm">
                        You must be logged in to view this page.
                    </div>
                </div>
            )}
        </main>
    )
}
