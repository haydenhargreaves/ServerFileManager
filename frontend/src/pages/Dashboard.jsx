import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DirectoryList from "../components/DirectoryList.jsx";
import PathDisplay from "../components/PathDisplay.jsx";
import Navbar from "../components/Navbar.jsx";
import Error from "../components/Error.jsx";
import Editor from "../components/Editor.jsx";

export default function Dashboard() {
    // Store the default path
    const defaultPath = ["media", "vault"];

    /**
     * URL To the backend web server.
     * Uses the .env var in local development, but when
     * pushed to dockerhub, the .env is ignored and the real
     * backend URL is used.
     * @type {string}
     */
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://backend.gophernest.net";

    const [token, setToken] = useState(null);
    const [path, setPath] = useState([...defaultPath]);
    const [showHidden, setShowHidden] = useState(false);
    const [selected, setSelected] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState("");
    const navigate = useNavigate();


    /**
     * The name of the value stored in local storage.
     * @type {string}
     */
    const storage_id = "gophernest_credentials";

    /**
     * Update the token from the local or session storage.
     * This function assumes one of them exists.
     * If it does not, the token will be null.
     * This function will return the token as well, to allow for other usecases.
     */
    const updateToken = () => {
        const t = localStorage.getItem(storage_id) ? localStorage.getItem(storage_id) : sessionStorage.getItem(storage_id);
        setToken(t);
        return t;
    };

    useEffect(() => {
        const getData = async (token) => {
            const response = await fetch(`${backendUrl}/v1/children?path=/${path.join("/")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Something went wrong");
            }
            return await response.json();
        }

        // If the token doesnt exit, udpate it and use the return value.
        // This is a silly work around to prevent the first render from not working
        // TODO: Fix this shit.
        let tkn = token ? token : updateToken();

        getData(tkn).then((data) => {
            setFiles(data);
        });

        setSelected([]);

    }, [path]);


    // Redirect if the user isn't logged in, otherwise update the state.
    // Store the token in the storage, it should be attached to every request.
    useEffect(() => {
        if (localStorage.getItem(storage_id) == null && sessionStorage.getItem(storage_id) == null) {
            navigate("/login");
        } else {
            updateToken();
        }
    }, [navigate]);

    /**
     * Updates the path by slicing [0:index]
     * @param index {number} Index to slice to.
     */
    const updatePath = (index) => {
        let newPath = path.slice(0, index + 1);
        if (newPath.length < defaultPath.length) {
            newPath = [...defaultPath];
        }
        setPath(newPath);
    };

    /**
     * Set the path back to the default.
     */
    const backHome = () => {
        // TODO: Fix this in production
        setPath([...defaultPath]);
    };

    /**
     * Add name to the path.
     * @param name Target child
     */
    const appendPath = (name) => {
        setPath([...path, name])
    };

    /**
     * Back arrow, goes back one directory (cd ..)
     */
    const backArrow = () => {
        if (path.length > defaultPath.length) {
            setPath(path.slice(0, path.length - 1));
        }
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
                const resp = await fetch(`${backendUrl}/v1/download`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({filePaths: paths}),
                });
                if (!resp.ok) {
                    const data = await resp.json();
                    setError(`Error ${data.code}: ${data.error}`);
                } else {
                    // TODO: Figure out how tf this works.
                    const blob = await resp.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "downloads.zip";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }
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

    const toggleEditing = (path) => {
        setEditing(path);
    };

    const exitFile = () => {
        setEditing("");
    };

    const exitAndSaveFile = (newContent) => {
        const updateContent = async (path, content) => {
            const resp = await fetch(`${backendUrl}/v1/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({path, content}),
            })
            if (!resp.ok) {
                setError("An error occurred when saving the file. Please try again.");
            }
            return await resp.json();
        };

        // Send request to server to update the file. This will return nothing
        // so no need for any promise handling.
        updateContent(editing, newContent);

        // Set editing back to nothing to hide the modal
        setEditing("");
    };


    /**
     * Handle the state for the content being modified in the text editor.
     */
    const [editingFileContent, setEditingFileContent] = useState("");
    useEffect(() => {
        const fetchContent = async (path) => {
            const resp = await fetch(`${backendUrl}/v1/content?path=${path}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!resp.ok) {
                // TODO: Add this back in, its broken right now.
                setError("Something went wrong! Failed to get file content.")
            }
            return await resp.json();
        };

        // Prevent running when nothing is being edited. Also prevents a call on mount.
        if (editing) {
            // Fetch the data and handle errors accordingly
            fetchContent(editing).then((data) => {
                if (data.code === 200) {
                    setEditingFileContent(data.content);
                } else {
                    // An error occurred, do not open the editor
                    setEditing("");
                    setError(data.error);
                }
            });
        }

    }, [editing]);

    const toggleHidden = (e) => {
        setShowHidden(e.target.checked);
    };

    return (
        <div className="w-full min-h-screen h-screen pb-8">
            <Navbar downloadFiles={downloadFiles}/>
            <div className="h-full w-full flex flex-col items-center justify-center pb-8">

                {error && <Error error={error} clear={clearError}/>}
                {(editing !== "" && !error) &&
                    <Editor content={editingFileContent} path={editing} exit={exitFile} saveExit={exitAndSaveFile}/>}

                <PathDisplay path={path} updatePath={updatePath} backHome={backHome} backArrow={backArrow}
                             enabled={path.length > defaultPath.length}/>
                <div className="w-2/3 h-5/6 overflow-y-auto border-1 border-gray-300">
                    <DirectoryList dirs={files} showHidden={showHidden} appendPath={appendPath}
                                   toggleSelected={toggleSelected} toggleEditing={toggleEditing}/>
                </div>
                <div className="w-2/3 flex justify-end items-center">
                    <label className="text-sm mx-2" htmlFor="showHiddenItems">Show Hidden Items</label>
                    <input
                        className="p-2"
                        name="showHiddenItems"
                        type="checkbox"
                        checked={showHidden}
                        onClick={toggleHidden}/>
                </div>
            </div>
        </div>
    )
}