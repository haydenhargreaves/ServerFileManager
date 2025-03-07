import {useEffect, useState} from "react";
import UserInput from "./UserInput.jsx";
import PasswordInput from "./PasswordInput.jsx";
import RememberMe from "./RememberMe.jsx";
import {useNavigate} from "react-router-dom";


export default function LoginForm() {
    /**
     * URL To the backend web server.
     * Uses the .env var in local development, but when
     * pushed to dockerhub, the .env is ignored and the real
     * backend URL is used.
     * @type {string}
     */
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://backend.gophernest.net";

    const [username, setUsername] = useState("");
    const [remember, setRemember] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /**
     * The name of the value stored in local storage.
     * @type {string}
     */
    const storage_id = "gophernest_credentials";

    /**
     * Set the email in the form state.
     * @param newUsername
     */
    const updateUsername = (newUsername) => {
        setUsername(newUsername);
    };

    /**
     * Set the 'remember me' in the form start.
     * @param newRemember
     */
    const updateRemember = (newRemember) => {
        setRemember(newRemember);
    };

    /**
     * Set the password in the form state.
     * @param newPassword
     */
    const updatePassword = (newPassword) => {
        setPassword(newPassword);
    };


    /**
     * Handle the login submission, data is stored in the local storage.
     * @param event {SubmitEvent}
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const sendAuthReq = async (username, password) => {
            const resp = await fetch(`${backendUrl}/v1/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });
            if (!resp.ok) {
                const data = await resp.json();
                console.error(data.message);
                setError(data.message);
                return data;
            }
            return await resp.json();
        };

        sendAuthReq(username, password).then((data) => {
            const {code, token} = data;

            // Should always be 200, but just make sure it is
            if (code === 200) {
                // Store JWT in session if the user does not want to be remembered
                remember ? localStorage.setItem(storage_id, token) : sessionStorage.setItem(storage_id, token);
                navigate("/login");
            } else {
                console.error(data);
                setError(data.message);
            }
        }).catch((err) => {
            console.error(err);
            setError(err.toString());
        }).finally(() => {
            // Disable loading bar
            setLoading(false);
        });
    };

    // Redirect if the user is logged in
    useEffect(() => {
        if (localStorage.getItem(storage_id) != null || sessionStorage.getItem(storage_id) != null) {
            navigate("/dashboard");
        }
    });

    useEffect(() => {
        console.log(`loading: ${loading}`);
    }, [loading]);


    return <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
        <UserInput onChange={updateUsername}/>
        <PasswordInput onChange={updatePassword}/>
        <RememberMe onChange={updateRemember}/>

        {error && <p className="w-full text-red-500 text-sm my-2">{error}</p>}

        <button type="submit"
                disabled={loading}
                className="mt-8 bg-blue-400 py-2 text-white w-full rounded-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-gray-400 text-xs text-center mt-6">
            If you do not have an account, you're in the wrong place!
        </p>
    </form>
};