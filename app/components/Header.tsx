import { Link } from "@remix-run/react"


function Header() {
  return (
    <Link to="/">
        <h1 className="text-center text-2xl text-teal-700 font-bold">Todo App</h1>
    </Link>
  )
}

export default Header