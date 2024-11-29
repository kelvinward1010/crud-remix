// app/routes/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Tablecopy from "~/components/Tablecopy";
import { URL_DATA } from "~/config";
import { fetchAPI } from "~/helpers/fetchAPI";
import { IPost } from "~/types/post";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Remix Search Example" },
        { name: "description", content: "Search functionality in Remix." },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const postsdata = await db.post.findMany({
        where: {
            OR: [
                { title: { contains: search} },
                { content: { contains: search} },
            ],
        },
    });

    const otherdata = fetchAPI(URL_DATA);

    const [posts, others] = await Promise.all([postsdata, otherdata])

    return {posts, others};
};

export default function Index() {
    const {posts, others}: {posts: IPost[], others: any[]} = useLoaderData();
    const postFetcher: any = useFetcher();
    const [searchQuery, setSearchQuery] = useState("");
    const titleInTable = ["ID", "Title", "Content"];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(true);
            if (searchQuery) {
                window.history.pushState({}, '', `/await?search=${searchQuery}`);
                postFetcher.load(`/await?search=${searchQuery}`);
            } else {
                window.history.pushState({}, '', `/await`);
                postFetcher.load(`/await`);
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        if(postFetcher.data && postFetcher.state === 'idle'){
            setIsLoading(false)
        }
    },[postFetcher.state])

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    

    return (
        <div>
            <Form method="get" action="/await" className="my-5 mx-5">
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search posts by title or content..."
                        className="border rounded p-2"
                    />
                    <button hidden type="submit"></button>
                </div>
            </Form>

            <postFetcher.Form />
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ):(
                <Await
                resolve={postFetcher.data?.posts || posts}
                errorElement={<p>Error loading posts.</p>}
            >
                {/* {(loadedPosts: any) => (
                    <ul>
                        {loadedPosts?.map((post: { id: number; title: string; content: string }) => (
                            <li key={post.id} className="flex flex-row gap-3 border border-teal-600 ">
                                <h3 className="w-1/2 text-center">{post.title}</h3>
                                <p className="w-1/2 text-center">{post.content}</p>
                            </li>
                        ))}
                    </ul>
                )} */}
                <Tablecopy title={titleInTable}/>
            </Await>
            )}
        </div>
    );
}



