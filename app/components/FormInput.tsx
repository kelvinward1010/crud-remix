
interface FormInputProps{
  title?: string;
  name: string;
  typeInput?: 'textarea' | 'normal';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
}

function FormInput({title, name, typeInput='normal', defaultValue}:FormInputProps) {
  return (
    <div className="flex flex-col bg-teal-600">
      {title && <label>{title}</label>}
      {typeInput === 'normal' && <input className='border border-cyan-700' type="text" name={name} defaultValue={defaultValue} />}
      {typeInput === 'textarea' && <textarea className='border border-cyan-700' name={name} defaultValue={defaultValue} />}
    </div>
  )
}

export default FormInput