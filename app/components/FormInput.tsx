
interface FormInputProps{
  title?: string;
  name: string;
  typeInput?: 'textarea' | 'normal';
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  error?: string;
}

function FormInput({title, name, typeInput='normal', defaultValue, onChange, error}:FormInputProps) {
  return (
    <div className="flex flex-col bg-teal-600">
      {title && <label className="text-white px-2">{title}</label>}
      {typeInput === 'normal' && <input onChange={onChange} className='border border-cyan-700' type="text" name={name} defaultValue={defaultValue} />}
      {typeInput === 'textarea' && <textarea  onChange={onChange}  className='border border-cyan-700' name={name} defaultValue={defaultValue} />}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  )
}

export default FormInput