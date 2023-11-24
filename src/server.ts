import { app } from "./app";
import { environment } from "./env";

app
  .listen({
    port: environment.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP Server Running");
  });
