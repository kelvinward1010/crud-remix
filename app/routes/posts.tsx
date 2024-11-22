import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Layout } from "~/components/Layout";

export const meta: MetaFunction = () => {
  return [
    { title: "Posts" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Posts() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  
  if (!initialRenderComplete) {
    return null;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
