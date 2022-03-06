# pacman-cache-server
Caching pacman mirror for faster downloads at home

### Install from github

```bash
git clone https://github.com/antonilol/pacman-cache-server.git
cd pacman-cache-server
npm i
npm run build
```

Copy the sample config and edit it (optional)
```bash
cp config.sample.json config.json
```

### Install from AUR

With an AUR helper, for example `yay`
```bash
yay -S pacman-cache-server-git
```

The config can be edited in `/usr/lib/pacman-cache-server-git/` and the server can be started with systemd with
```
systemctl start pacman-cache-server
```

### Usage

Start the server with
```bash
npm run start
```

On the clients, add
```
Server = http://<host>:<port>/$repo/os/$arch
```
at the top of `/etc/pacman.d/mirrorlist`

Replace
`<host>` with the IP address of your server (or `localhost` if you run it on the same machine) and
`<port>` with the http port specified in `config.json` (default: 8080)


This server redirects all requests to the mirror specified in `config.json`
and saves a local copy of the file in `cacheDir`.
When the next time the same file is requested, instead of asking the mirror for it,
the local copy is given to the client.

By default, only `*.pkg.tar.zst` and `*.pkg.tar.zst.sig` are cached (this can be changed in `config.json`).
It is not recommended to include `*.db` here because the package database changes without the filename changing.

To not get your disk at 100% somewhere in the future you can schedule a cron job to run
[pkgcacheclean](https://aur.archlinux.org/packages/pkgcacheclean) every week/month.
(Requires `cacheDir` to be set at pacman's cache dir `/var/cache/pacman/pkg/`)
