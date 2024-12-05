// routes/api/fetch-posts2.ts
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    try {
        const post2 = { name: "kelvin", age: 25 };
        // Giả lập độ trễ 3 giây
        await new Promise(resolve => setTimeout(resolve, 3000));
        return json(post2);
    } catch (error: any) {
        return json({ error: error.message }, { status: 500 });
    }
};
