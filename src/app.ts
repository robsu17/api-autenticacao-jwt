import fastify from "fastify";
import { routes } from "./routes/routes";
import authenticate from "./middleware/middleware";

export const app = fastify();

app.register(routes);

app.decorate("authenticate", authenticate);
