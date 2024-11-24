
import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import Button from '~/components/Button';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
    return [
      { title: "Post Detail" },
      { name: "description", content: "Welcome to Remix!" },
    ];
};

type Post = {
    id: number;
    title: string;
    content: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    const id = Number(params.postID);
    if (isNaN(id)) { 
        throw new Error("Invalid post ID"); 
    }
    const post = await db.post.findUnique({ where: { id: id } });
    return { post };
};

export default function Post() {
    const {post} = useLoaderData<typeof loader>();

    return (
        <div className="w-10/12 mb-5 m-auto h-auto p-1 border border-cyan-500">
            <div className='w-full flex flex-rown justify-between'>
                <h3 className="text-red-600">Title: {post.title}</h3>
                <Link to={`/posts/edit/${post.id}`}>
                    <Button className='rounded bg-teal-600 text-white' title='Edit'/>
                </Link>
            </div>
            <p className="text-orange-500">Content: {post.content}</p>
        </div>
    );
}
