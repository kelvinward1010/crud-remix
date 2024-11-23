import { Link } from "@remix-run/react";
import Button from "./Button";

interface FormPostProps{
    data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: any;
        title: string;
        content: string;
    },
    onClickOpenDelete: () => void;
}

function FormPost({data, onClickOpenDelete}: FormPostProps) {
  return (
    <div className="w-full mb-2 flex justify-between px-3 h-auto p-1 border border-cyan-500">
        <h3 className="text-red-600">Title: {data.title}</h3>
        <div className="flex flex-row gap-2 align-middle">
          <Link to={`/posts/${data.id}`}>View</Link>
          <Button onClick={onClickOpenDelete} title='Delete' className='bg-red-600 text-white'/>
        </div>
    </div>
  )
}

export default FormPost