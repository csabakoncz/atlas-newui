### After cloning this repo:
```
git submodule update --init
```

Build Atlas webapp
```
cd atlas
mvn package -DskipTests -am -pl webapp
cd ..
```

Start Atlas webapp
```
./start-atlas.sh

```
wait to come up on `http://localhost:21000`

In another terminal start the server for the UI (Webpack dev server and does
API proxying to the java webapp):
```
npm run dev-server
```

Production mode:
```
npm run build # creates bundles in the ./dist folder
npm run server # server for the ./dist folder and API proxy
```

