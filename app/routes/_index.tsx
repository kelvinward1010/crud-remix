import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Layout } from "~/components/Layout";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect } from "react-router-dom";
import FormPost from "~/components/FormPost";
import FormInput from "~/components/FormInput";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type Post = {
  id: number;
  title: string;
  content: string;
};

export const loader: LoaderFunction = async () => {
  const posts = await db?.post.findMany();
  return { posts };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const method = formData.get('_method');
  
  if(method === 'post'){
    const title = formData.get('title') as string ?? '';
    const content = formData.get('content') as string ?? '';

    await db.post.create({ data: { title, content } });
    return redirect('/');
  }else if (method === 'delete') {
    const id = formData.get('postID');
    if(id){
      await db.post.delete({ where: { id: Number(id) } });
      return redirect('/');
    }
  }
  return null;
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: Post[] }>();
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null); 

  const openModal = () => setShowModal(true); 
  const closeModal = () => setShowModal(false);

  const openModalDelete = (id: number) => {
    setSelectedPostId(id);
    setIsDeleteModal(true)
  }; 
  const closeModalDelete = () => {
    setSelectedPostId(null);
    setIsDeleteModal(false)
  };
  
  return (
    <Layout>
      <Button title="Create New Post" onClick={openModal}/>
      <div className="mt-5"/>
      {posts.map((post) => (
          <FormPost onClickOpenDelete={() => openModalDelete(post.id)} data={post} key={post.id}/>
      ))}
      <Modal showModal={showModal} onClose={closeModal} width="w-1/2">
        <div className=' w-full'>
            <h1>New Post</h1>
            <Form method="post" className='flex flex-col float-start w-full'>
              <input type="hidden" name="_method" value="post" />
              <div className='flex justify-start gap-2 flex-col'>
                <FormInput title='Title' name='title' />
                <FormInput typeInput={'textarea'} title='Content' name='content' />
                <div className="flex justify-center">
                  <Button title='Create'/>
                  <Button title="Cancel" onClick={closeModal} className="bg-gray-600 text-white" /> 
                </div>
              </div>
            </Form>
        </div>
      </Modal>
      <Modal showModal={isDeleteModal} onClose={closeModalDelete} width="w-1/2">
        <div> 
          <p className="text-center">Do you want to delete this post?</p> 
          <Form method="post"> 
            <input type="hidden" name="_method" value="delete" /> 
            <input type="hidden" name="postID" value={selectedPostId || ''} /> 
            <div className="flex justify-center"> 
              <Button title="Delete" className="bg-red-600 text-white mx-2" /> 
              <Button title="Cancel" onClick={closeModalDelete} className="bg-gray-600 text-white mx-2" /> 
            </div> 
          </Form>
        </div>
      </Modal>
    </Layout>
  );
}

