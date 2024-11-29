import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { db } from "~/utils/db.server";
import { IPost } from "~/types/post";
import TableOther from "~/components/TableOther";

export const meta: MetaFunction = () => {
    return [
        { title: "Remix Search Example" },
        { name: "description", content: "Search functionality in Remix." },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const posts = await db.post.findMany({
        where: {
            OR: [
                { title: { contains: search } },
                { content: { contains: search } },
            ],
        },
    });

    return json(posts);
};

// export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
//     const url = new URL(request.url);
//     const search = url.searchParams.get("search") || "";
//     const postsdata = await db.post.findMany({
//         where: {
//             OR: [
//                 { title: { contains: search } },
//                 { content: { contains: search } },
//             ],
//         },
//     });

//     return json(postsdata);
// };

export default function Index() {
    const posts = useLoaderData<IPost[]>();
    const fetcher = useFetcher<IPost[]>();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                window.history.pushState({}, '', `/clientaction?search=${searchQuery}`);
                fetcher.load(`/clientaction?search=${searchQuery}`);
            } else {
                window.history.pushState({}, '', `/clientaction`);
                fetcher.load(`/clientaction`);
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <Form className="my-5 mx-5">
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search posts by title or content..."
                        className="border rounded p-2"
                    />
                </div>
            </Form>

            {fetcher.data ? (
                <TableOther title={["ID", "Title", "Content"]} data={fetcher.data} />
            ) : (
                <TableOther title={["ID", "Title", "Content"]} data={posts} />
            )}
        </div>
    );
}
