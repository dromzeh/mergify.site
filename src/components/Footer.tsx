import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faGithub,
    faCloudflare,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center w-full h-24">
            <p className="text-sm mb-2">
                built by dromzeh with ❤️ using next.js & tailwindcss
            </p>
            <div className="flex items-center space-x-2">
                <Link
                    href="https://github.com/dromzeh/mergify.site"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon
                        icon={faGithub}
                        className="w-4 h-4 hover:text-white"
                    />
                </Link>
                <Link
                    href="https://www.cloudflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon
                        icon={faCloudflare}
                        className="w-4 h-4 hover:text-white"
                    />
                </Link>
                <Link
                    href="https://twitter.com/dromzeh"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon
                        icon={faTwitter}
                        className="w-4 h-4 hover:text-white"
                    />
                </Link>
            </div>
        </footer>
    )
}
