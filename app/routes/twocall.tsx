import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, defer, Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  const fetchPosts = new Promise(async (resolve, reject) => {
    try {
      const posts = await db.post.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ]
        }
      });
      setTimeout(() => resolve(posts), 2000); // Giả lập độ trễ 2 giây
    } catch (error) {
      reject(error);
    }
  });

  const fetchPosts2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: "kelvin", age: 25 });
    }, 3000); // Giả lập độ trễ 3 giây
  });

  return defer({
    posts: fetchPosts,
    posts2: fetchPosts2,
  });
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
    const navigate = useNavigate();

    useEffect(() => {
        if (posts.status === 'success' && posts2.status === 'success') {
            setIsLoading(false);
        } else if (posts.status === 'error' || posts2.status === 'error') {
            setLoaderError('There was an error loading data.');
        }
    }, [posts, posts2]);

    useEffect(() => {
        if (posts?.data) {
            setIsLoading(false);
        }
    }, [posts]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                navigate(`/twocall?search=${searchQuery}`);
            } else {
                navigate('/twocall');
            }
        }, 1500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, navigate]);

    if (loaderError) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <p>Error: {loaderError}</p>
                </div>
            </Layout>
        );
    }

    // if (isLoading) {
    //     return (
    //         <Layout>
    //             <div className="flex justify-center items-center h-screen">
    //                 Loading...
    //             </div>
    //         </Layout>
    //     )
    // }

    console.log(posts, posts2)

    return (
        <Layout>
            <div onClick={() => navigate('/clearcallapi')}>BUTTON</div>
            <div>
                <Suspense fallback={<div>Loading posts...</div>}>
                    <Await resolve={posts}>
                        {(data) => (
                            <div>
                                <h2>Posts</h2>
                                <pre>{JSON.stringify(data, null, 2)}</pre>
                            </div>
                        )}
                    </Await>
                </Suspense>

                <Suspense fallback={<div>Loading additional data...</div>}>
                    <Await resolve={posts2}>
                        {(data) => (
                            <div>
                                <h2>Additional Data</h2>
                                <pre>{JSON.stringify(data, null, 2)}</pre>
                            </div>
                        )}
                    </Await>
                </Suspense>
            </div>
        </Layout>
    );
}