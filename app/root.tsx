import type { Route } from "./+types/root";
import stylesUrl from "~/app.css?url";

import {
  isRouteErrorResponse,
  Outlet,
  data,
  useLoaderData,
} from "react-router";

import { useEffect } from "react";
import { useUser } from "~/store";

import { Document } from "~/features/document";

import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  return data({
    DOMAIN: context.cloudflare.env.DOMAIN,
    CDN_URL: context.cloudflare.env.CDN_URL,
    GOOGLE_ANALYTICS_ID: context.cloudflare.env.GOOGLE_ANALYTICS_ID,
    GOOGLE_ADS_ID: context.cloudflare.env.GOOGLE_ADS_ID,
    GOOGLE_CLIENT_ID: context.cloudflare.env.GOOGLE_CLIENT_ID,
  });
};

export const Layout = ({ children }: React.PropsWithChildren) => {
  const data = useLoaderData<typeof loader>();

  return (
    <Document
      lang="en"
      theme="cupcake"
      DOMAIN={data?.DOMAIN}
      // GOOGLE_ADS_ID={data?.GOOGLE_ADS_ID} // 控制是否加载 AdSense 的自动广告
      GOOGLE_ANALYTICS_ID={data?.GOOGLE_ANALYTICS_ID}
    >
      {children}
    </Document>
  );
};
export default function App({}: Route.ComponentProps) {
  const setUser = useUser((state) => state.setUser);
  const setCredits = useUser((state) => state.setCredits);

  useEffect(() => {
    fetch("/api/auth").then(async (res) => {
      if (res.ok) {
        const data = await res.json<{
          profile: UserInfo | null;
          credits: number;
        }>();
        setUser(data.profile);
        setCredits(data.credits);
      } else {
        setUser(null);
      }
    });
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
