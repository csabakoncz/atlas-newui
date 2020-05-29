### After cloning this repo:
```
git submodule update --init
```

Build Atlas webapp:
```
cd atlas
mvn package -DskipTests -am -pl webapp
cd ..
```

Start Atlas webapp:
```
./start-atlas.sh

```
wait for it to come up on `http://localhost:21000`

In another terminal start the server for the UI (Webpack dev server and
API proxying to the Java webapp):
```
npm run dev-server
```

### Production mode:
 - build the Webpack bundles:
```
npm run build # populates ./dist folder
```
 - Launch Express server for serving the content of `./dist` and API proxy
```
npm run server
```

