
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import Button from '~/components/Button';
import FormInput from '~/components/FormInput';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
    return [
      { title: "Edit Post" },
      { name: "description", content: "Welcome to Remix!" },
    ];
};

type Post = {
    id: number;
    title: string;
    content: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    const post = await db.post.findUnique({ where: { id: Number(params.postID) } });
    return { post };
};

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const method = formData.get('_method');

    if (method === 'delete') {
        await db.post.delete({ where: { id: Number(params.postID) } });
        return redirect('/posts');
    }

    const title = formData.get('title') as string ?? '';
    const content = formData.get('content') as string ?? '';

    await db.post.update({
        where: { id: Number(params.postID) },
        data: { title, content }
    });
    return redirect(`/posts/${params.postID}`);
};

export default function EditPost() {
    const { post } = useLoaderData<{ post: Post }>();

    return (
        <div className='w-9/12 border border-teal-600 mx-auto'>
            <h1 className='text-center'>Edit Post</h1>
            <Form method="post" className='text-center'>
                <input type="hidden" name="_method" value="put" />
                <FormInput title='Title' name='title' defaultValue={post.title}/>
                <FormInput typeInput={'textarea'} title='Content' name='content' defaultValue={post.content}/>
                <Button title='Update'className='bg-teal-600 text-white'/>
            </Form>
            <Form method="post" className='w-full text-center'>
                <input type="hidden" name="_method" value="delete" />
                <Button title='Delete' className='bg-red-600 text-white'/>
            </Form>
        </div>
    );
}
