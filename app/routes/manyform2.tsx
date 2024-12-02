import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const formId = formData.get('formId');
    let form1Data = {};
    let form2Data = {};

    if (formId === 'form1') {
        form1Data = {
            field1A: formData.get('field1A'),
            field1B: formData.get('field1B'),
        };
        console.log("Form 1 Data:", form1Data);
    } else if (formId === 'form2') {
        form2Data = {
            field2A: formData.get('field2A'),
            field2B: formData.get('field2B'),
        };
        console.log("Form 2 Data:", form2Data);
    }

    return json({ message: `Data from ${formId} submitted`, form1Data, form2Data });
};

export default function ManyForm() {

    return (
        <div>
            <form method="post" id="form1">
                <input type="hidden" name="formId" value="form1" />
                <input type="text" name="field1A" placeholder="Field 1A" />
                <input type="email" name="field1B" placeholder="Field 1B" />
                <button type="submit">Submit Form 1</button>
            </form>

            <form method="post" id="form2">
                <input type="hidden" name="formId" value="form2" />
                <input type="text" name="field2A" placeholder="Field 2A" />
                <input type="number" name="field2B" placeholder="Field 2B" />
                <button type="submit">Submit Form 2</button>
            </form>
        </div>
    );
}
