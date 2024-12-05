import { ActionFunction, json } from "@remix-run/node";
import { data, Form, useActionData, useFetcher } from "@remix-run/react";



export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    // const formId = formData.get('formId');

    // if (formId === 'form1') {
    //     const field1A = formData.get('field1A');
    //     const field1B = formData.get('field1B');
    //     // Xử lý dữ liệu từ form1
    //     return json({ message: 'Form 1 submitted', field1A, field1B });
    // }

    // if (formId === 'form2') {
    //     const field2A = formData.get('field2A');
    //     const field2B = formData.get('field2B');
    //     // Xử lý dữ liệu từ form2
    //     return json({ message: 'Form 2 submitted', field2A, field2B });
    // }

    // return json({ message: 'Unknown form submission' });

    // const data = Object.fromEntries(formData);
    
    // // Dữ liệu từ form 1
    // const field1A = data.field1A;
    // const field1B = data.field1B;

    // // Dữ liệu từ form 2
    // const field2A = data.field2A;
    // const field2B = data.field2B;
    // console.log(field1A, field1B, field2A, field2B)
    // // Xử lý dữ liệu từ cả hai form
    // return json({ message: 'Both forms submitted', data });


    const form1: {[key: string]: any} = {};
    const form2: {[key: string]: any} = {};

    for(const [key, value] of formData.entries()){
        if(key.startsWith('form1.')){
            form1[key.replace('form1.', '')] = value;
        } else if (key.startsWith('form2.')) { 
            form2[key.replace('form2.', '')] = value;
        }
    }

    // Xử lý dữ liệu từ form 1 
    const { field1A, field1B } = form1; 
    
    // Xử lý dữ liệu từ form 2 
    const { field2A, field2B } = form2;

    
    const converted ={
        form1: form1,
        form2: form2,
    }
    console.log(converted)

    return json({ message: 'Both forms submitted', converted });
};

export default function ManyForm() {
    const actionData: any = useActionData();

    const fetcher = useFetcher();

    console.log(fetcher.data)

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const form1: any = document.getElementById('form1');
        const form2: any = document.getElementById('form2');
        
        // const combinedData: any = { 
        //     form1: Object.fromEntries(new FormData(form1).entries()), 
        //     form2: Object.fromEntries(new FormData(form2).entries()), 
        // };

        const formData = new FormData();
        new FormData(form1).forEach((value, key) => formData.append(`form1.${key}`, value));
        new FormData(form2).forEach((value, key) => formData.append(`form2.${key}`, value));

        fetcher.submit(formData, { method: 'post' });
    }
    return (
        <div>
            {/* <Form method="post" action="a2">
                <label>
                    Name:
                    <input className="border border-teal-600" type="text" name="name" required />
                </label>
                <label>
                    Email:
                    <input className="border border-teal-600" type="email" name="email" required />
                </label>
                <button type="submit">Submit</button>
            </Form>
            {actionData && actionData?.success && (
                <p>{actionData?.message}</p>
            )}
            {actionData && actionData.error && (
                <p style={{ color: 'red' }}>{actionData?.error}</p>
            )} */}

            {/* <div>
                <form id="form1" method="post">
                    <input type="hidden" name="formId" value="form1" />
                    <input type="text" name="field1A" placeholder="Field 1A" />
                    <input type="email" name="field1B" placeholder="Field 1B" />
                    <button type="submit">Submit Form 1</button>
                </form>
                <form id="form2" method="post">
                    <input type="hidden" name="formId" value="form2" />
                    <input type="text" name="field2A" placeholder="Field 2A" />
                    <input type="number" name="field2B" placeholder="Field 2B" />
                    <button type="submit">Submit Form 2</button>
                </form>
            </div> */}


            <div>
                <form id="form1" method="post">
                    <input type="text" name="field1A" placeholder="Field 1A" />
                    <input type="email" name="field1B" placeholder="Field 1B" />
                </form>
                <form id="form2" method="post">
                    <input type="text" name="field2A" placeholder="Field 2A" />
                    <input type="number" name="field2B" placeholder="Field 2B" />
                </form>
                <button onClick={handleSubmit} type="submit">Submit Form 2</button>
            </div>
        </div>
    );
}


