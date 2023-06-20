import React, { useState } from 'react'
import { MergeProps } from '@/lib/spotify/types'
import SpotifyWebApi from 'spotify-web-api-js'
import { chunk } from 'lodash'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'

const Merge: React.FC<{
    playlists: MergeProps['playlists']
    selectedPlaylists: MergeProps['selectedPlaylists']
    session: MergeProps['session']
    onCancel: () => void
}> = ({ playlists, selectedPlaylists, session, onCancel }) => {
    const [playlistName, setPlaylistName] = useState('')
    const [isMerging, setIsMerging] = useState(false)
    const [isMerged, setIsMerged] = useState(false)
    const [playlistId, setPlaylistId] = useState('')
    const [isPublic, setIsPublic] = useState(false)

    const handlePlaylistNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPlaylistName(event.target.value)
    }

    const mergeConfirm = async () => {
        setIsMerging(true)

        const spotifyApi = new SpotifyWebApi()
        spotifyApi.setAccessToken(session.access_token)

        try {
            const newPlaylist = await spotifyApi.createPlaylist(session.id, {
                name: playlistName,
                description: 'merged playlist created by mergify.site',
                public: isPublic,
            })

            const trackIds = await Promise.all(
                selectedPlaylists.map(async (playlistId) => {
                    const { items } = await spotifyApi.getPlaylistTracks(
                        playlistId
                    )
                    return items.map((item) => item.track.id)
                })
            ).then((arrays) => arrays.flat())

            const trackIdChunks = chunk(trackIds, 100)

            // spotify only allows 100 tracks to be added at a time
            for (const chunk of trackIdChunks) {
                await spotifyApi.addTracksToPlaylist(
                    newPlaylist.id,
                    chunk.map((id) => `spotify:track:${id}`)
                )
                await new Promise((resolve) => setTimeout(resolve, 3000))
            }

            setPlaylistId(newPlaylist.id)
            setPlaylistName('')
            setIsMerging(false)
            setIsMerged(true)
        } catch (error) {
            console.error(error)
            setIsMerging(false)
        }
    }

    return (
        <div className="fixed inset-0 overflow-auto bg-black/50 z-50 backdrop-blur-lg">
            <div className="flex min-h-screen flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center bg-background-100 rounded-md p-8">
                        <div className="items-center">
                            <h1 className="text-2xl font-bold text-center text-white">
                                Playlist Merger
                            </h1>
                            {isMerged ? (
                                <p className="text-center text-green-100 font-semibold">
                                    Your playlists has been merged!
                                </p>
                            ) : (
                                <p className="text-center text-gray-400 font-semibold">
                                    Lets make a name for your new playlist
                                </p>
                            )}
                        </div>
                        {!isMerged ? (
                            <>
                                <div className="w-full flex flex-row gap-2">
                                    <input
                                        type="text"
                                        className="mt-4 w-full bg-[#0C0C0C] text-white font-semibold rounded-md p-2 text-sm focus:outline-none"
                                        placeholder="New playlist name"
                                        value={playlistName}
                                        onChange={handlePlaylistNameChange}
                                    />
                                    <div className="mt-4 bg-[#0C0C0C] text-white font-semibold rounded-md p-2 text-sm focus:outline-none">
                                        <div className="align-center">
                                            <FontAwesomeIcon
                                                icon={
                                                    isPublic
                                                        ? faLockOpen
                                                        : faLock
                                                }
                                                className={`transition ${
                                                    isPublic
                                                        ? 'text-green-100'
                                                        : 'text-red-100'
                                                }`}
                                                onClick={() =>
                                                    setIsPublic(!isPublic)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                {playlistName.length > 32 && (
                                    <p className="text-red-200 text-sm font-semibold">
                                        Please enter a name less than 32
                                        characters
                                    </p>
                                )}
                                <button
                                    disabled={
                                        playlistName.length < 1 ||
                                        isMerging ||
                                        playlistName.length > 32
                                    }
                                    onClick={mergeConfirm}
                                    className={`
                                    hover:bg-green-100 hover:text-[#0C0C0C]
                                    transition mt-4 w-full bg-[#0C0C0C] text-green-100 font-semibold rounded-md p-2 text-sm ${
                                        playlistName.length < 1 ||
                                        isMerging ||
                                        playlistName.length > 32
                                            ? 'opacity-50'
                                            : ''
                                    }`}
                                >
                                    {isMerging
                                        ? 'Merging...'
                                        : `Merge ${selectedPlaylists.length} playlists`}
                                </button>
                                <button
                                    className="mt-4 w-full bg-[#0C0C0C] text-red-100 font-semibold rounded-md p-2 text-sm
                                  hover:bg-red-100 hover:text-[#0C0C0C] transition"
                                    onClick={onCancel}
                                >
                                    Cancel Merge
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="mt-4 w-full bg-[#0C0C0C] text-white font-semibold rounded-md p-2 text-sm
                                    hover:bg-white hover:text-[#0C0C0C] transition"
                                    onClick={onCancel}
                                >
                                    <Link
                                        href={`https://open.spotify.com/playlist/${playlistId}`}
                                    >
                                        View on Spotify
                                    </Link>
                                </button>

                                <button
                                    className="mt-4 w-full bg-[#0C0C0C] text-red-100 font-semibold rounded-md p-2 text-sm
                              hover:bg-red-100 hover:text-[#0C0C0C] transition"
                                    onClick={onCancel}
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Merge
