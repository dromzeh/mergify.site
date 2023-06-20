# mergify.site

[![CodeFactor](https://www.codefactor.io/repository/github/dromzeh/mergify.site/badge)](https://www.codefactor.io/repository/github/dromzeh/mergify.site)

a site which merges multiple spotify playlists into one, using next.js, typescript, tailwindcss, and next-auth

## but doesn't this exist in spotify already?

yes, but this was solely made for the purpose of learning & because it's annoying to do it manually

## how to use

1. clone the repo
2. create a `.local.env` file with the following contents:

```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
NEXTAUTH_SECRET
```

3. `pnpm install & pnpm run dev`

## deployment

deploy on vercel - hosting on something like next-on-pages might work but it's not tested. if you are using vercel, make sure to set the environment variables in the vercel dashboard & read https://next-auth.js.org/warnings#nextauth_url if you aren't
