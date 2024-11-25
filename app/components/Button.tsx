

interface ButtonProps{
    title: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: string;
}

function Button({title, className, onClick, disabled=false, type}:ButtonProps) {
  return <button disabled={disabled} onClick={onClick} className={`${className} m-auto w-fit px-2 py-1 border border-teal-600`} type="submit">{title}</button>
}

export default Button