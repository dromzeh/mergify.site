import { Session } from 'next-auth'

export interface Playlist {
    name: string
    collaborative: boolean
    description: string
    external_urls: {
        spotify: string
    }
    tracks: {
        href: string
        total: string
    }
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
}
export interface MergeProps {
    session: Session
    playlists: Playlist[]
    selectedPlaylists: string[]
}
export interface PlaylistManagerProps {
    playlists: Playlist[]
    selectedPlaylists: string[]
    searchQuery: string
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onPlaylistClick: (playlist: Playlist) => void
    onMerge: () => void
}

export interface SpotifyProfileProps {
    imageUrl: string
    userName: string
    onLogout: () => void
}
