import { ActionFunction } from '@remix-run/node';
import { Form, redirect } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string ?? '';
    const content = formData.get('content') as string ?? '';

    await db.post.create({ data: { title, content } });
    return redirect('/');
};

export default function NewPost() {
    return (
        <div>
            <h1>New Post</h1>
            <Form method="post">
                <div className='flex justify-start gap-2 flex-col'>
                    <label>
                        Title: <input className='border border-cyan-700' type="text" name="title" />
                    </label>
                    <label>
                        Content: <textarea className='border border-cyan-700' name="content"></textarea>
                    </label>
                    <button type="submit">Create</button>
                </div>
            </Form>
        </div>
    );
}
