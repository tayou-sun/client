Web UI client of Dashboard platform.
React/Redux SPA.

### install dependencies
`npm i`

### Configure connection to server
Add correct alias to server (dashboard.local - see `src/config/config.js`) to drivers\etc\hosts

### run dev server http://localhost:3000/
`npm start`

### build static version and docker image
npm run build
docker build -t dashboard-web-client:VERSION .

### run in container
docker run --name dashboard-web-client -p 3000:80 -d dashboard-web-client:VERSION

# open in browser
http://localhost:3000
