
// import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
// import { Form, useLoaderData } from '@remix-run/react';
// import { db } from '~/utils/db.server';

// type Post = {
//     id: number;
//     title: string;
//     content: string;
// };

// export const loader: LoaderFunction = async ({ params }) => {
//     const post = await db.post.findUnique({ where: { id: Number(params.id) } });
//     return { post };
// };

// export const action: ActionFunction = async ({ request, params }) => {
//     const formData = await request.formData();
//     const method = formData.get('_method');

//     if (method === 'delete') {
//         await db.post.delete({ where: { id: Number(params.id) } });
//         return redirect('/posts');
//     }

//     const title = formData.get('title') as string ?? '';
//     const content = formData.get('content') as string ?? '';

//     await db.post.update({
//         where: { id: Number(params.id) },
//         data: { title, content }
//     });
//     return redirect(`/posts/${params.id}`);
// };

export default function EditPost() {
    //const { post } = useLoaderData<{ post: Post }>();

    return (
        <div>
            {/* <h1>Edit Post</h1>
            <Form method="post">
                <input type="hidden" name="_method" value="put" />
                <label>
                    Title: <input type="text" name="title" defaultValue={post.title} />
                </label>
                <label>
                    Content: <textarea name="content" defaultValue={post.content}></textarea>
                </label>
                <button type="submit">Update</button>
            </Form>
            <Form method="post">
                <input type="hidden" name="_method" value="delete" />
                <button type="submit">Delete</button>
            </Form> */}
            ok edit 
        </div>
    );
}
