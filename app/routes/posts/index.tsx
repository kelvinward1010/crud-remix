import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type Post = {
  id: number;
  title: string;
  content: string;
};

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany();
  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <div>
      <h1>Posts</h1>
      <Link to="/posts/new">Create New Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
