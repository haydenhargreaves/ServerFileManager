import "../index.css";
import LoginForm from "../components/LoginForm.jsx";

function Login() {
    /**
     * This is just for allowing easy changes to the domain, if a change occurs.
     * @type {string}
     */
    const domain = "files.gophernest.net"

    return <>
        <div className="min-h-screen h-screen w-full bg-gray-200 flex items-center justify-center">
            <h2 className="absolute top-0 left-0 font-[550] font-mono italic text-xl m-6">{domain}</h2>
            <div className="w-2/7 h-fit bg-white border-1 rounded-sm border-gray-300 p-12">
                <p className="text-gray-400">Please enter your details</p>
                <h1 className="text-3xl font-semibold mt-2 mb-12"> Welcome Back </h1>
                <LoginForm/>
            </div>
        </div>
    </>
}

export default Login;