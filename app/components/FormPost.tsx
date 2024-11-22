import { Link } from "@remix-run/react";

interface FormPostProps{
    data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: any;
        title: string;
        content: string;
    }
}

function FormPost({data}: FormPostProps) {
  return (
    <div className="w-full mb-2 flex justify-between px-3 h-auto p-1 border border-cyan-500">
        <h3 className="text-red-600">Title: {data.title}</h3>
        <Link to={`/posts/${data.id}`}>View</Link>
    </div>
  )
}

export default FormPost