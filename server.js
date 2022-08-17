// permet de crée un serveur
const http = require("http");
const app = require("./app");
// const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT, () => console.log(`server running at ${PORT}`));
