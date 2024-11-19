import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  return (
    <div>
      <h1>Welcome to the Blog</h1>
      <nav>
        <Link to="/posts">View All Posts</Link>
      </nav>
      <Outlet />
    </div>
  );
}

