import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Layout } from "~/components/Layout";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect } from "react-router-dom";
import FormInput from "~/components/FormInput";
import { IPost } from "~/types/post";
import TableCpnt from "~/components/TableCpnt";
import { postSchema } from "~/utils/validationSchema";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface FormPostProps {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
    title: string;
    content: string;
  },
  onClickOpenDelete: () => void;
}

export const loader: LoaderFunction = async () => {
  const posts = await db?.post.findMany();
  return { posts };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const method = formData.get('_method');

  if (method === 'post') {
    const title = formData.get('title') as string ?? '';
    const content = formData.get('content') as string ?? '';

    await db.post.create({ data: { title, content } });
    return redirect('/');
  } else if (method === 'delete') {
    const id = formData.get('postID');
    if (id) {
      await db.post.delete({ where: { id: Number(id) } });
      return redirect('/');
    }
  }
  return null;
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: IPost[] }>();
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' }); 
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetcher = useFetcher();

  // const openModalDelete = (id: number) => {
  //   setSelectedPostId(id);
  //   setIsDeleteModal(true)
  // };
  const closeModalDelete = () => {
    setSelectedPostId(null);
    setIsDeleteModal(false)
  };
  
  const titleInTable = ["ID", "Title", "Content", "Actions"];

  const validate = () => { 
    const validation = postSchema.safeParse(formData); 
    if (validation.success) { 
      setErrors({}); 
      return true; 
    } else { 
      const newErrors: { [key: string]: string } = {}; 
      validation.error.errors.forEach(error => { 
        newErrors[error.path[0] as string] = error.message; 
      }); 
      setErrors(newErrors); return false; } 
  }; 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value }); 
    if (errors[name]) { 
      setErrors({ ...errors, [name]: '' }); 
    } 
  }; 
    
  const handleSubmit = (e: React.FormEvent) => { 
    if (!validate()) { 
      e.preventDefault(); 
    }
  }

  return (
    <Layout>
      <Button title="Create New Post" className='rounded mx-5 bg-teal-600 text-white' onClick={openModal} />
      <div className="mt-5" />
      <TableCpnt setIsDeleteModal={setIsDeleteModal} setSelectedPostId={setSelectedPostId} title={titleInTable} data={posts ?? []} />
      <Modal showModal={showModal} onClose={closeModal} width="w-1/2">
        <div className=' w-full'>
          <h1>New Post</h1>
          <fetcher.Form onSubmit={handleSubmit} method="post" className='flex flex-col float-start w-full'>
            <input type="hidden" name="_method" value="post" />
            <div className='flex justify-start gap-2 flex-col'>
              <FormInput error={errors.title} onChange={handleInputChange} title='Title' name='title' />
              <FormInput error={errors.content} onChange={handleInputChange} typeInput={'textarea'} title='Content' name='content' />
              <div className="flex justify-center">
                <Button title='Create' className='rounded bg-teal-600 text-white' />
                <Button title="Cancel" onClick={closeModal} className="bg-gray-600 rounded text-white" />
              </div>
            </div>
          </fetcher.Form>
        </div>
      </Modal>
      <Modal showModal={isDeleteModal} onClose={closeModalDelete} width="w-1/2">
        <div>
          <p className="text-center">Do you want to delete this post?</p>
          <fetcher.Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="postID" value={selectedPostId || ''} />
            <div className="flex justify-center">
              <Button title="Delete" className="bg-red-600 rounded text-white mx-2" />
              <Button title="Cancel" onClick={closeModalDelete} className="bg-gray-600 rounded text-white mx-2" />
            </div>
          </fetcher.Form>
        </div>
      </Modal>
    </Layout>
  );
}

export function FormPost({ data, onClickOpenDelete }: FormPostProps) {
  return (
    <div className="w-full mb-2 flex justify-between px-3 h-auto p-1 border border-cyan-500">
      <h3 className="text-red-600">Title: {data.title}</h3>
      <div className="flex flex-row gap-2 align-middle">
        <Link to={`/posts/${data.id}`}>
          <Button title="View" className='rounded bg-teal-600 text-white' />
        </Link>
        <Button onClick={onClickOpenDelete} title='Delete' className='bg-red-600 border-none rounded text-white' />
      </div>
    </div>
  )
}