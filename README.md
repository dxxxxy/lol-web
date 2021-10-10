# lol-web
Early development. Redesign of the League Client using `LCU` together with `electron` and `socket.io` to dynamically update the viewport. No API key needed. <kbd>dxxxxy#5818</kbd>.

## Credits
```python
# ready-to-go template with electron and socket.io integration
clytras - https://github.com/clytras/electron-sockets
# automatic connection to LCU on client launch
Pupix - https://github.com/Pupix/lcu-connector
# api for league related assets
Riot - https://ddragon.leagueoflegends.com/
```

## Get Started
```python
# Clone this repository
git clone https://github.com/DxxxxY/lol-web.git
# Go into the repository
cd lol-web
# Install dependencies
npm install
# Run the server socket
node ./socket/index.js

##### Make sure League Client is runnning at this point #####

# Run the app
npm start
```
