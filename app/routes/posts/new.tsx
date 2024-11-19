import { Form, redirect } from '@remix-run/react';
import { db } from '~/utils/db.server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const action = async ({ request }: any) => {
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
                <label>
                    Title: <input type="text" name="title" />
                </label>
                <label>
                    Content: <textarea name="content"></textarea>
                </label>
                <button type="submit">Create</button>
            </Form>
        </div>
    );
}
