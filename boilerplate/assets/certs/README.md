For local development self-signed certs are stored here.
The server when GameServer.instance.webServer.enableLocalSSL();
is used, will look for assets/certs/localhost.key and
assets/certs/localhost.cert and use those for SSL.

We use these self-signed certs to allow https://localhost
& wss://localhost support. Without this, play.hytopia.com
requires a bunch of funky browser flag workarounds in
order to connect to your local server. This is only used
for local development and will be ignored when your game
is deployed to HYTOPIA servers.