import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IPost } from "~/types/post";

export default function Index() {
    const fetcherPosts: any = useFetcher();
    const fetcherPosts2: any = useFetcher();
    const [posts, setPosts] = useState<{ status: string, data: IPost[] | null, error: string | null }>({
        status: 'pending',
        data: null,
        error: null
    });
    const [posts2, setPosts2] = useState<{ status: string, data: any | null, error: string | null }>({
        status: 'pending',
        data: null,
        error: null
    });

    useEffect(() => {
        fetcherPosts.load("/api/loader1");
    }, [fetcherPosts]);

    useEffect(() => {
        fetcherPosts2.load("/api/loader2");
    }, [fetcherPosts2]);

    useEffect(() => {
        if (fetcherPosts.data) {
            if (fetcherPosts.data?.error) {
                setPosts({ status: 'error', data: null, error: fetcherPosts.data.error });
            } else {
                setPosts({ status: 'success', data: fetcherPosts.data, error: null });
            }
        }
    }, [fetcherPosts.data]);

    useEffect(() => {
        if (fetcherPosts2.data) {
            if (fetcherPosts2.data.error) {
                setPosts2({ status: 'error', data: null, error: fetcherPosts2.data.error });
            } else {
                setPosts2({ status: 'success', data: fetcherPosts2.data, error: null });
            }
        }
    }, [fetcherPosts2.data]);

    return (
        <div>
            {posts.status === 'pending' && <div>Loading posts...</div>}
            {posts.status === 'error' && <div>Error loading posts: {posts.error}</div>}
            {posts.status === 'success' && (
                <div>
                    <h2>Posts</h2>
                    <pre>{JSON.stringify(posts.data, null, 2)}</pre>
                </div>
            )}

            {posts2.status === 'pending' && <div>Loading additional data...</div>}
            {posts2.status === 'error' && <div>Error loading additional data: {posts2.error}</div>}
            {posts2.status === 'success' && (
                <div>
                    <h2>Additional Data</h2>
                    <pre>{JSON.stringify(posts2.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
