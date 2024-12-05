import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "react-router-dom";
import { IPost } from "~/types/post";

type LoaderData = {
    posts: IPost[];
    additionalData: { name: string; age: number };
    error?: string;
};

// Giả lập một hàm fetch dữ liệu từ cơ sở dữ liệu
async function fetchPostsFromDB(search: string, signal: AbortSignal): Promise<IPost[]> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1", content: "Content 1" },
        { id: 2, title: "Post 2", content: "Content 2" },
      ]);
    }, 2000);

    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new Error("Fetch aborted"));
    });
  });
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  const controller = new AbortController();
  const { signal } = controller;

  try {
    const fetchPosts = fetchPostsFromDB(search, signal);

    const post2 = new Promise<{ name: string, age: number }>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        resolve({ name: "kelvin", age: 25 });
      }, 3000);

      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        console.log("clear")
        reject(new Error("Fetch aborted"));
      });
    });

    const [posts, additionalData] = await Promise.all([fetchPosts, post2]);

    return json({ posts, additionalData });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function DisplayData() {
  const data: any = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  if (data.error) {
    return <div>Error: {data.error}</div>;
  }

  return (
    <div>
      <h2>Posts</h2>
      <div onClick={() => navigate('/twocall')}>BUTTON</div>
      <pre>{JSON.stringify(data.posts, null, 2)}</pre>

      <h2>Additional Data</h2>
      <pre>{JSON.stringify(data.additionalData, null, 2)}</pre>
    </div>
  );
}
