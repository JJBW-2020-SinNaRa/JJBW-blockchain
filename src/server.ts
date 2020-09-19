import {
  app,
} from "./api/app";
import {
  createServer,
  Server,
} from "http";

let server: Server;
const port = parseInt(process.env.PORT) || 4000;

const start = async () => {
  server = createServer(app);
  server.listen(port, () => {
    console.info(`Application started at ${port}.`);
  });
};

start().catch((e) => {
  console.error(e);
});
