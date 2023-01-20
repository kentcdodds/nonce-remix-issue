import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect } from "react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ context }: DataFunctionArgs) {
  return json({ nonce: context.nonce as string });
}

export default function App() {
  const { nonce } = useLoaderData<typeof loader>();

  useEffect(() => {
    alert(`I GOTCHA NONCE!!! ${nonce}`);
  }, [nonce]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
