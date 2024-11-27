import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');

    // check
    if (typeof name !== 'string' || typeof email !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
    }

    // Trả về phản hồi thành công
    return json({ success: true, message: 'Form submitted successfully!' });
};

export default function Test() {
  const actionData: any = useActionData();

  return (
    <div>
      <Form method="post">
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
      )}
    </div>
  );
}


