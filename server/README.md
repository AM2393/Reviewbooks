# Server commands

## Dev Setup

### Install dependencies

```shell
$ npm install
```

### Init database

```shell
$ npm run init-db
```

> [!NOTE]
> Database will be created in `{projectRoot}/database/OpenPage`
> without the database app won't work

### Remove database data

```shell
$ npm run purge-db
```

> [!CAUTION]
> This will remove all data and tables from the database (database file will stay).

### Run server in hot-reload mode

```shell
$ npm run start
```

### Run server in verbose/debug mode

```shell
$ npm run dev
```

> [!TIP]
> Don't forget to set up port in `app.js` file! By default app uses port `3000`
> After that you can open http://localhost:{port}/ in your browser
> eg. http://localhost:3000/

### Run in normal mode

```shell
$ node app.js
```

## API Documentation
- after app is running you can visit http://localhost:{port}/api-docs/; eg. http://localhost:3000/api-docs/
- [OpenPage API Documentation](http://localhost:3000/api-docs/)

## Production

### Install dependencies

```shell
$ npm install --omit=dev
```

### Init database

```shell
$ npm run init-db
```

### Run

```shell
$ node app.js
```

or with [PM2](https://pm2.io/) ?
