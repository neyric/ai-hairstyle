import { type RouteConfig, layout, prefix } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const routes = await flatRoutes();
const apiRoutes = await flatRoutes({ rootDirectory: "./routes/_api" });
const webhooksRoutes = await flatRoutes({
  rootDirectory: "./routes/_webhooks",
});
const callbackRoutes = await flatRoutes({
  rootDirectory: "./routes/_callback",
});
const metaRoutes = await flatRoutes({ rootDirectory: "./routes/_meta" });
const legalRoutes = await flatRoutes({ rootDirectory: "./routes/_legal" });
const baseRoutes = await flatRoutes({ rootDirectory: "./routes/base" });

export default [
  layout("./routes/base/layout/index.tsx", baseRoutes),
  ...routes,
  ...prefix("api", apiRoutes),
  ...prefix("webhooks", webhooksRoutes),
  ...prefix("callback", callbackRoutes),
  ...prefix("legal", legalRoutes),
  ...metaRoutes,
] satisfies RouteConfig;
