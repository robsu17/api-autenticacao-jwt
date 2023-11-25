import { app } from "./app";
import { environment } from "./env";

app
  .listen({
    port: environment.PORT || 3000,
  })
  .then(() => {
    console.log("🚀 HTTP Server Running");
  });
