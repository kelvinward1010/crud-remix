// routes/api/fetch-posts.ts
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { IPost } from "~/types/post";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    try {
        const posts = await db.post.findMany({
            where: {
                OR: [
                    { title: { contains: search } },
                    { content: { contains: search } },
                ]
            }
        });
        // Giả lập độ trễ 2 giây
        await new Promise(resolve => setTimeout(resolve, 2000));
        return json(posts);
    } catch (error: any) {
        return json({ error: error.message }, { status: 500 });
    }
};
