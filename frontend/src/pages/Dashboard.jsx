import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DirectoryList from "../components/DirectoryList.jsx";
import PathDisplay from "../components/ PathDisplay.jsx";
import Navbar from "../components/Navbar.jsx";
import Error from "../components/Error.jsx";


export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [path, setPath] = useState(["home", "azpect"]);
    const [showHidden, setShowHidden] = useState(false);
    const [selected, setSelected] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            console.log(`http://localhost:5000/v1/children?path=/${path.join("/")}`);
            const response = await fetch(`http://localhost:5000/v1/children?path=/${path.join("/")}`)
            if (!response.ok) {
                console.error("Something went wrong");
            }
            return await response.json();
        }
        getData().then((data) => {
            setFiles(data);
        });

        setSelected([]);

    }, [path]);

    /**
     * The name of the value stored in local storage.
     * @type {string}
     */
    const storage_id = "gophernest_credentials";

    // Redirect if the user isn't logged in, otherwise update the state.
    useEffect(() => {
        if (localStorage.getItem(storage_id) == null && sessionStorage.getItem(storage_id) == null) {
            navigate("/login");
        } else {
            if (localStorage.getItem(storage_id)) {
                setUsername(JSON.parse(localStorage.getItem(storage_id))["username"]);
            } else if (sessionStorage.getItem(storage_id)) {
                setUsername(JSON.parse(sessionStorage.getItem(storage_id))["username"]);
            }
        }
    }, [navigate]);

    /**
     * Updates the path by slicing [0:index]
     * @param index {number} Index to slice to.
     */
    const updatePath = (index) => {
        setPath(path.slice(0, index + 1));
    };

    /**
     * Set the path back to the default, home directory.
     */
    const backHome = () => {
        setPath(["home", "azpect"]);
    };

    /**
     * Add name to the path.
     * @param name Targe child
     */
    const appendPath = (name) => {
        setPath([...path, name])
    };

    /**
     * Back arrow, goes back one directory (cd ..)
     */
    const backArrow = () => {
        setPath(path.slice(0, path.length - 1));
    }

    /**
     * This isn't fast, but hopefully the use case will be small batches.
     * @param file {string} The file to toggle
     */
    const toggleSelected = (file) => {
        if (!selected.includes(file)) {
            setSelected([...selected, file]);
        } else {
            const idx = selected.indexOf(file);
            setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected.length)])
        }
    };

    /**
     * Callback function for when the download button is clicked.
     */
    const downloadFiles = () => {
        // Do not allow empty downloads
        if (selected.length === 0) {
            setError("Please select files/directories to download.");
        }

        const download = async (paths) => {
            try {
                const resp = await fetch("http://localhost:5000/v1/download", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({filePaths: paths}),
                });
                if (!resp.ok) {
                    throw new Error(`HTTP error! status: ${resp.status}`);
                }

                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "downloads.zip";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error(`Download error: ${err}`);
            }
        };
        const targets = [];
        selected.forEach((file) => {
            targets.push(`/${path.join("/")}/${file}`);
        });

        // TODO: Implement UI for errors
        download(targets).catch((err) => {
            setError(`Download error: ${err}.`)
        });
    };

    /**
     * Clear the error in the error state.
     */
    const clearError = () => {
        setError(null);
    }

    return (
        <div className="w-full min-h-screen h-screen pb-8">
            <Navbar downloadFiles={downloadFiles}/>
            <div className="h-full w-full flex flex-col items-center justify-center pb-8">

                {error && <Error error={error} clear={clearError}/>}

                <PathDisplay path={path} updatePath={updatePath} backHome={backHome} backArrow={backArrow}/>
                <div className="w-2/3 h-5/6 overflow-y-auto border-1 border-gray-300">
                    <DirectoryList dirs={files} showHidden={showHidden} appendPath={appendPath}
                                   toggleSelected={toggleSelected}/>
                </div>
            </div>
        </div>
    )
}