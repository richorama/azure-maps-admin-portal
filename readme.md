# Azure Maps Admin Portal

![](screenshot.png)

### [Available Here](https://richorama.github.io/azure-maps-admin-portal)

## About

A browser-based application enabling you to manage the data in an Azure Maps Data Service.


## Self Hosting

You can expose the root folder as a static website, and use the app straight away.

1. Create a new folder for this project within your filesystem
2. Open a terminal window and `cd` to the new folder
3. Run `git clone https://github.com/richorama/azure-maps-admin-portal.git`
4. `cd` into the new `azure-maps-admin-portal` folder
5. Run `npx node-static`
6. Visit `http://127.0.0.0:8080` in a web browser
7. Enter your Azure Maps key then visit the `Uploaded Data` screen
8. Select a file to view it on the map!

## Developing

To develop the website:

```
$ npm install
$ npm run watch & npx node-static
```

To build the site:

```
$ npm run build
```

## License

MIT
