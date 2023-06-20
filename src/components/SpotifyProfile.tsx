import Image from 'next/image'
import type { SpotifyProfileProps } from '@/lib/spotify/types'

export function SpotifyProfile({
    imageUrl,
    userName,
    onLogout,
}: SpotifyProfileProps) {
    return (
        <div className="flex items-center">
            <Image
                src={imageUrl}
                width={25}
                height={25}
                className="rounded-md mr-2"
                alt={'spotify profile'}
            />
            <div>
                <p className="text-sm">Logged in as {userName}</p>
                <p className="text-xs">
                    <button
                        onClick={onLogout}
                        className="text-xs hover:text-white animate"
                    >
                        Logout
                    </button>
                </p>
            </div>
        </div>
    )
}
