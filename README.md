# pacman-cache-server
Caching pacman mirror for faster downloads at home

### Install

```bash
git clone https://github.com/antonilol/pacman-cache-server.git
cd pacman-cache-server
npm i
npm run build
```

Copy the sample config and edit it
```bash
cp config.sample.json config.json
```

### Usage

Start the server with
```bash
npm run start
```

On the client, add
```
Server = http://<host>:<port>/$repo/os/$arch
```
at the top of `/etc/pacman.d/mirrorlist`

Replace
`<host>` with the IP address of your server (or `localhost` if you run it on the same machine) and
`<port>` with the http port specified in `config.json` (default: 8080)
