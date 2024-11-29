import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Layout } from "~/components/Layout";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect, useNavigate } from "react-router-dom";
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

export const loader: LoaderFunction = async ({request}) => {

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  const results: { 
    posts: { status: string, data: IPost[] | null, error: string | null }, 
    posts2: { status: string, data: any | null, error: string | null } 
  } = {
    posts: { status: 'pending', data: null, error: null},
    posts2: { status: 'pending', data: null, error: null},
  }

  try { 
    const posts = await db?.post.findMany({
      where: {
        OR: [
          {title: { contains: search}},
          {content: { contains: search}},
        ]
      }
    }); 
    results.posts = { status: 'success', data: posts, error: null }; 
  } catch (error: any) { 
    results.posts = { status: 'error', data: null, error: error?.message }; 
  }

  try { 
    const post2 = await Promise.resolve({
      name: "kelvin",
      age: 25,
    });
    results.posts2 = { status: 'success', data: post2, error: null }; 
  } catch (error: any) { 
    results.posts2 = { status: 'error', data: null, error: error?.message }; 
  }
  return results;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const method = formData.get('_method');
  
  if (method === 'post') {
    console.log(formData.get('form1'))
    const title = formData.get('title') as string ?? '';
    const content = formData.get('content') as string ?? '';

    await db.post.create({ data: { title, content } });
    return null;
  } else if (method === 'delete') {
    const id = formData.get('postID');
    if (id) {
      await db.post.delete({ where: { id: Number(id) } });
      return null;
    }
  }
  return null;
};

export default function Index() {
  const { posts, posts2 } = useLoaderData<{ 
    posts: { status: string, data: IPost[] | null, error: string | null }, 
    posts2: { status: string, data: any | null, error: string | null } 
  }>();
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' }); 
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loaderError, setLoaderError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const postFetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => { 
    if (posts.status === 'success' && posts2.status === 'success') { 
      setIsLoading(false); 
    } else if (posts.status === 'error' || posts2.status === 'error') { 
      setLoaderError('There was an error loading data.'); 
    } 
  }, [posts, posts2]);

  useEffect(() => {
    if(posts?.data){
      setIsLoading(false);
    }
  },[posts]);

  useEffect(() => { 
    const timeoutId = setTimeout(() => { 
      if (searchQuery) { 
        //window.history.pushState({}, '', `/?search=${searchQuery}`);
        navigate(`/?search=${searchQuery}`); 
      }else{
        //window.history.pushState({}, '', `/`);
        navigate('/');
      }
    }, 1500); 
    return () => clearTimeout(timeoutId); 
  }, [searchQuery, navigate]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
      setErrors(newErrors); 
      return false; 
    } 
  }; 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value }); 
    if (errors[name]) { 
      setErrors({ ...errors, [name]: '' }); 
    } 
  }; 

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchQuery(e.target.value); 
  };
    
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (validate()) { 
      postFetcher.submit(
        { 
          title: formData.title, 
          content: formData.content, 
          _method: 'post',
        }, 
        { method: 'post', action: "/" } 
      ); 
      closeModal()
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    navigate(`/?search=${searchQuery}`);
    postFetcher.submit( 
      { search: searchQuery }, 
      { method: 'get', action: "/" } 
    );
  };

  if (loaderError) { 
    return ( 
      <Layout> 
        <div className="flex justify-center items-center h-screen"> 
          <p>Error: {loaderError}</p> 
        </div> 
      </Layout> 
    ); 
  }

  if(isLoading){
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <Form 
        onSubmit={handleSearchSubmit} 
        className="my-5 mx-5"
      > 
        <div className="flex gap-2"> 
          <input type="text" name="search" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search posts by title or content..." className="border rounded p-2" />
          <Button title="Search" className="rounded bg-teal-600 text-white" /> 
        </div> 
      </Form>

      <Button title="Create New Post" className='rounded mx-5 bg-teal-600 text-white' onClick={openModal} />
      <div className="mt-5" />
      <TableCpnt setIsDeleteModal={setIsDeleteModal} setSelectedPostId={setSelectedPostId} title={titleInTable} data={posts?.data ?? []} />
      <Modal showModal={showModal} onClose={closeModal} width="w-1/2">
        <div className=' w-full'>
          <h1>New Post</h1>
          <postFetcher.Form onSubmit={handleSubmit} method="post" className='flex flex-col float-start w-full'>
            <div className='flex justify-start gap-2 flex-col'>
              <FormInput error={errors.title} onChange={handleInputChange} title='Title' name='title' />
              <FormInput error={errors.content} onChange={handleInputChange} typeInput={'textarea'} title='Content' name='content' />
              <div className="flex justify-center">
                <Button title='Create' className='rounded bg-teal-600 text-white' />
                <Button title="Cancel" onClick={closeModal} className="bg-gray-600 rounded text-white" />
              </div>
            </div>
          </postFetcher.Form>
        </div>
      </Modal>
      <Modal showModal={isDeleteModal} onClose={closeModalDelete} width="w-1/2">
        <div>
          <p className="text-center">Do you want to delete this post?</p>
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="postID" value={selectedPostId || ''} />
            <div className="flex justify-center">
              <Button title="Delete" className="bg-red-600 rounded text-white mx-2" />
              <Button title="Cancel" onClick={closeModalDelete} className="bg-gray-600 rounded text-white mx-2" />
            </div>
          </Form>
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