import type { Route } from "./+types/route";
import file from "./file.txt?raw";

export const loader = ({ context }: Route.LoaderArgs) => {
  const DOMAIN = context.cloudflare.env.DOMAIN;
  const domain = DOMAIN.endsWith("/") ? DOMAIN.slice(0, -1) : DOMAIN;

  return new Response(file.replace(/{DOMAIN}/g, domain), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
