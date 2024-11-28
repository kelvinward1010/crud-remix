import { useAsyncValue } from "react-router-dom";
import { IPost } from "~/types/post";

interface TableProps {
    title: string[];
    data: IPost[]
}

function TableOther({ title, data }: TableProps) {
 
    return (
        <div className='w-full h-auto flex justify-start mx-5'>
            <table style={{ padding: "0 3px" }}>
                <thead>
                    <tr className="border border-teal-600 text-center bg-gray-400">
                        {title.map((i, idx) => {
                            return <th className="border border-teal-600 px-12 text-white text-base font-light" key={idx}>{i}</th>;
                        })}
                    </tr>
                </thead>
                <tbody className="tablebodymain">
                    {data?.map((post: IPost) => (
                        <tr className="border border-teal-600" key={post.id}>
                            <td className="border border-teal-600 w-auto px-1 text-center">{post?.id}</td>
                            <td className="border border-teal-600 w-auto px-1">{post?.title}</td>
                            <td className="border border-teal-600 w-auto px-1">{post?.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableOther;