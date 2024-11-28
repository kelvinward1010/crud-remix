
import { Link, PrefetchPageLinks } from "@remix-run/react";
import { IPost } from "~/types/post";
import Button from "./Button";

interface TableProps {
    title: string[];
    data: IPost[];
    setSelectedPostId: (id: number) => void;
    setIsDeleteModal: (isOpen: boolean) => void;
}

function TableCpnt({ title, data, setSelectedPostId, setIsDeleteModal }: TableProps) {
    const handleDelete = (id: number) => {
        setSelectedPostId(id);
        setIsDeleteModal(true);
    }
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
                    {data?.map((user: IPost, idx) => (
                        <tr className="border border-teal-600" key={idx}>
                            <td className="border border-teal-600 w-auto px-1 text-center">{user?.id}</td>
                            <td className="border border-teal-600 w-auto px-1">{user?.title}</td>
                            <td className="border border-teal-600 w-auto px-1">{user?.content}</td>
                            <td className="border border-teal-600 w-auto px-1">
                                <div className="flex flex-row gap-2 align-middle">
                                    <Link to={`/posts/${user?.id}`}>
                                        <Button title="View" className='rounded bg-teal-600 text-white' />
                                    </Link>
                                    {/* <PrefetchPageLinks page={`/posts/${user?.id}`}/> */}
                                    <Button onClick={() => handleDelete(user.id)} title='Delete' className='bg-red-600 border-none rounded text-white' />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableCpnt;