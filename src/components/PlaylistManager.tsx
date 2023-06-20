import { useMemo } from 'react'
import type { Playlist } from '@/lib/spotify/types'
import type { PlaylistManagerProps } from '@/lib/spotify/types'

export function PlaylistManager({
    playlists,
    selectedPlaylists,
    searchQuery,
    onSearchChange,
    onPlaylistClick,
    onMerge,
}: PlaylistManagerProps) {
    const filteredPlaylists = useMemo(() => {
        return playlists.filter((playlist) =>
            playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [playlists, searchQuery])

    return (
        <div className="mt-6 w-full">
            <div>
                <p className="text-2xl font-bold text-white">
                    Select playlists to merge
                </p>
                <p className="text-xs">
                    Showing {filteredPlaylists.length} of {playlists.length}{' '}
                    playlists
                </p>
            </div>
            <input
                className="mt-4 w-full bg-[#0C0C0C] text-white font-semibold rounded-md p-2 text-sm focus:outline-none"
                placeholder="Search playlists"
                value={searchQuery}
                onChange={onSearchChange}
            />
            <button
                disabled={selectedPlaylists.length < 2}
                className={`
                hover:bg-green-100 hover:text-[#0C0C0C]
                transition mt-4 w-full bg-[#0C0C0C] text-green-100 font-semibold rounded-md p-2 text-sm ${
                    selectedPlaylists.length < 2 ? 'opacity-50' : ''
                }`}
                onClick={onMerge}
            >
                Merge {selectedPlaylists.length} playlists
            </button>
            <div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaylists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className={`cursor-pointer bg-[#0c0c0c] rounded-md p-4 border-2 ${
                                selectedPlaylists.includes(playlist.id)
                                    ? 'border-white'
                                    : 'border-[#0c0c0c] hover:border-[#1a1a1a]'
                            } transition ${
                                parseInt(playlist.tracks.total) === 0
                                    ? 'opacity-50 pointer-events-none'
                                    : ''
                            }`}
                            onClick={() => {
                                if (parseInt(playlist.tracks.total) > 0) {
                                    onPlaylistClick(playlist)
                                }
                            }}
                        >
                            <div>
                                <p className="font-semibold text-white">
                                    {playlist.name}
                                </p>
                                <p className="text-xs text-gray-400 font-semibold">
                                    {playlist.tracks.total} songs
                                </p>
                                <p className="text-xs overflow-clip mt-2">
                                    {playlist.description || 'No description'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
