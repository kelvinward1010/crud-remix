import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Layout } from "~/components/Layout";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect } from "react-router-dom";
import NewPost from "~/components/NewPost";
import FormPost from "~/components/FormPost";

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
    return redirect('/posts');
  }
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: Post[] }>();
  const [showModal, setShowModal] = useState(false); 
  const openModal = () => setShowModal(true); 
  const closeModal = () => setShowModal(false);
  
  return (
    <Layout>
      <Button title="Create New Post" onClick={openModal}/>
      <div className="mt-5"/>
      {posts.map((post) => (
          <FormPost data={post} key={post.id}/>
      ))}
      <Modal showModal={showModal} onClose={closeModal} width="w-1/2">
        <NewPost />
      </Modal>
    </Layout>
  );
}

