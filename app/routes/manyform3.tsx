import { ActionFunction, json } from "@remix-run/node";
import { useActionData, useFetcher, useNavigation } from "@remix-run/react";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const form1: { [key: string]: any } = {};
    const form2: { [key: string]: any } = {};

    for (const [key, value] of formData.entries()) {
        if (key.startsWith('form1.')) {
            form1[key.replace('form1.', '')] = value;
        } else if (key.startsWith('form2.')) {
            form2[key.replace('form2.', '')] = value;
        }
    }

    // Xử lý dữ liệu từ form 1 
    const { field1A, field1B } = form1;
    // Xử lý dữ liệu từ form 2 
    const { field2A, field2B } = form2;

    const converted = {
        form1: form1,
        form2: form2,
    };
    console.log(converted);

    return json({ message: 'Both forms submitted', converted });
};

export default function ManyForm() {
    const actionData: any = useActionData();
    const fetcher = useFetcher();
    const transition = useNavigation();
    console.log(transition)

    const [form1, setForm1] = useState({ field1A: '', field1B: '' });
    const [form2, setForm2] = useState({ field2A: '', field2B: '' });

    const handleChangeForm1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm1(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeForm2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm2(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form1).forEach(([key, value]) => formData.append(`form1.${key}`, value));
        Object.entries(form2).forEach(([key, value]) => formData.append(`form2.${key}`, value));

        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <div>
            <form id="form1" onSubmit={handleSubmit} method="post">
                <input
                    type="text"
                    name="field1A"
                    placeholder="Field 1A"
                    value={form1.field1A}
                    onChange={handleChangeForm1}
                />
                <input
                    type="email"
                    name="field1B"
                    placeholder="Field 1B"
                    value={form1.field1B}
                    onChange={handleChangeForm1}
                />
            </form>
            <form id="form2" onSubmit={handleSubmit} method="post">
                <input
                    type="text"
                    name="field2A"
                    placeholder="Field 2A"
                    value={form2.field2A}
                    onChange={handleChangeForm2}
                />
                <input
                    type="number"
                    name="field2B"
                    placeholder="Field 2B"
                    value={form2.field2B}
                    onChange={handleChangeForm2}
                />
            </form>
            <button type="submit" onClick={(e: any) =>handleSubmit(e)}>Submit Both Forms</button>
            {transition.state === "submitting" && ( <div>Loading...</div> )}
        </div>
    );
}
