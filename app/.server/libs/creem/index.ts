import { env } from "cloudflare:workers";
import { CreemApiClient } from "./client";

export const createCreem = () => {
  let client: CreemApiClient;
  if (import.meta.env.PROD) client = new CreemApiClient();
  else {
    client = new CreemApiClient(
      "https://test-api.creem.io",
      env.CREEM_TEST_KEY
    );
  }

  return client;
};
