# Express and React

`npx create-react-app client`

Install npm concurrently as dev dependency

```sh
"client": "npm start --prefix client",
"dev": "concurrently \"npm run server\" \"npm run client\""
```

Note: any React specific npm install should be done in the client folder.

Proxy in client?

`"proxy": "http://localhost:3000"`