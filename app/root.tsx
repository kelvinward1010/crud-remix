import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning={true} suppressContentEditableWarning={true}>
      <head>
        <meta charSet="UTF-8"/>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary(){
  const error = useRouteError();

  if(isRouteErrorResponse(error)){
    return (
      <div className="bg-yellow-500">
        {error.status}
        {error.statusText}
      </div>
    )
  }

  if(error instanceof Error){
    return(
      <div className="bg-red-500">
        {error.message}
      </div>
    )
  }

  return (
    <div className="bg-red-500">
      Your app died
    </div>
  )
}