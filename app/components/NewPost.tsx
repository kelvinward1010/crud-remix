import { Form } from '@remix-run/react';
import Button from '~/components/Button';
import FormInput from '~/components/FormInput';


export default function NewPost() {
    return (
        <div className=' w-full'>
            <h1>New Post</h1>
            <Form method="post" className='flex flex-col float-start w-full'>
                <div className='flex justify-start gap-2 flex-col'>
                <FormInput title='Title' name='title' />
                <FormInput typeInput={'textarea'} title='Content' name='content' />
                <Button title='Create'/>
                </div>
            </Form>
        </div>
    );
}
