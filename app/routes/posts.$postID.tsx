
import { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

type Post = {
    id: number;
    title: string;
    content: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    const id = Number(params.id);
    if (isNaN(id)) { 
        throw new Error("Invalid post ID"); 
    }
    const post = await db.post.findUnique({ where: { id: id } });
    return { post };
};

export default function Post() {
    const { post } = useLoaderData<{ post: Post }>();

    return (
        <div>
            <h1>{post.title ?? ''}</h1>
            <p>{post.content ?? ''}</p>
            <Link to={`/posts/${post.id}/edit`}>Edit</Link>
            ok
        </div>
    );
}
