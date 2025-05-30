import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DirectoryList from "../components/DirectoryList.jsx";
import PathDisplay from "../components/PathDisplay.jsx";
import Navbar from "../components/Navbar.jsx";
import Error from "../components/Error.jsx";
import Editor from "../components/Editor.jsx";
import ChildrenLoading from "../components/ChildrenLoading.jsx";
import DownloadLoading from "../components/DownloadLoading.jsx";
import Uploader from "../components/Uploader.jsx";
import CreateDirectory from "../components/CreateDirectory.jsx";
import MoveDirectory from "../components/MoveDirectory.jsx";

export default function Dashboard() {
  // ---- CONSTANTS ---- //
  /**
   * Default path
   * Uses the .env var in local development, but when
   * pushed to dockerhub, the .env is ignored and the 
   * default path is used.
   */
  const defaultPath = (import.meta.env.VITE_DEFAULT_PATH || "media,vault").split(',');

  /**
   * URL To the backend web server.
   * Uses the .env var in local development, but when
   * pushed to dockerhub, the .env is ignored and the 
   * real backend URL is used.
   */
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://backend.gophernest.net";

  /**
   * The name of the value stored in local storage.
   */
  const storage_id = "gophernest_credentials";


  // ---- STATE ---- //

  // General state
  const [token, setToken] = useState(null);
  const [path, setPath] = useState([...defaultPath]);
  const [files, setFiles] = useState([]);

  // User settings
  const [showHidden, setShowHidden] = useState(false);
  const [selected, setSelected] = useState([]);

  // Modals
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState(false);


  // Loading spinners
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);


  // Handle the state for the content being modified in the text editor.
  const [editingFileContent, setEditingFileContent] = useState("");

  // Other
  const navigate = useNavigate();

  // ---- FUNCTIONS ---- //

  /**
   * Update the token from the local or session storage.
   * This function assumes one of them exists.
   * If it does not, the token will be null.
   * This function will return the token as well, to allow for other usecases.
   * @returns {string | null} Token from browser storage
   */
  const updateToken = () => {
    const t = localStorage.getItem(storage_id) ? localStorage.getItem(storage_id) : sessionStorage.getItem(storage_id);
    setToken(t);
    return t;
  };

  /**
   * Clear the error in the error state.
   */
  const clearError = () => setError(null);

  /**
   * Toggle editing of a file.
   * @param path {string}
   */
  const toggleEditing = (path) => setEditing(path);

  /**
   * Close the file that is being edited.
   */
  const exitFile = () => setEditing("");

  /**
   * Show the hidden files
   */
  const toggleHidden = (e) => setShowHidden(e.target.checked);

  /**
   * Toggle the upload modal.
   * This can be used in the navbar and the close button!
   */
  const toggleUploading = () => setUploading(!uploading);

  /** 
   * Show the creating modal.
   */
  const createDir = () => {
    setSelected([]);
    setCreating(true);
  }

  /** 
   * Hide the creating modal.
   */
  const closeCreate = () => setCreating(false);

  /** 
   * Hide the moving modal.
   */
  const closeMoving = () => setMoving(false);

  /** 
   * Show the moving modal.
   */
  const showMoving = () => setMoving(true);

  // ---- HANDLERS --- //

  /**
   * Updates the path by slicing [0:index]
   * @param index {number} - Index to slice to.
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
   * TODO: Fix this in production? Not sure why
   */
  const backHome = () => setPath([...defaultPath]);

  /**
   * Add name to the path.
   * @param name {string} - Target child
   */
  const appendPath = (name) => setPath([...path, name])

  /**
   * Back arrow, goes back one directory (cd ..)
   */
  const backArrow = () => {
    if (path.length > defaultPath.length) {
      setPath(path.slice(0, path.length - 1));
    }
  }

  const exitAndSaveFile = (newContent) => {
    // Send request to server to update the file. This will return nothing
    // so no need for any promise handling.
    updateContent(editing, newContent).then((data) => {
      if (data.code === 200) {
        setEditing("");
      }
    });
  };

  /**
   * This isn't fast, but hopefully the use case will be small batches.
   * @param file {string} - The file to toggle
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
      return
    }

    setDownloadLoading(true);

    const targets = selected.map((file) => `/${path.join("/")}/${file}`);

    download(targets).catch((err) => {
      setError(`Download error: ${err}.`)
    }).finally(() => {
      setDownloadLoading(false)
    });
  };

  /**
   * Create a directory or file in the backend
   * @param name {string} Name of new file or directory
   */
  const createDirectory = (name) => {
    create(name, path).then((data) => {
      if (data.code === 201) {
        setCreating(false);
      }
    }).catch((error) => {
      setError(error);
    });
  };

  /**
   * Remove the selected files.
   */
  const removeSelected = () => {
    if (selected.length === 0) {
      setError("Please select files or directories to delete");
      return;
    }

    // Files are stored as arrays of paths
    const files = selected.map((file) => [...path, file]);

    remove(files).then((data) => {
      if (data.code === 201) {
        setSelected([]);

        // Fetch the new files & deselect everything
        fetchFiles();
      }
    }).catch((error) => {
      setError(error);
    });
  };

  const moveSelected = (newPath) => {
    const oldPath = "/" + [...path, selected].join("/");

    console.log("@oldPath", oldPath);
    console.log("@newPath", newPath);

    move(oldPath, newPath).then((data) => {
      if (data.code === 200) {
        setMoving(false);
        setSelected([]);
        fetchFiles();
      }
    });
  };

  // ---- SERVER FUNCTIONS ---- //

  /**
   * Fetch a list of files in the current directory.
   */
  const fetchFiles = () => {
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

    setChildrenLoading(true);

    // If the token doesnt exit, update it and use the return value.
    // This is a silly work around to prevent the first render from not working
    // TODO: Fix this shit.
    let tkn = token ? token : updateToken();

    getData(tkn).then((data) => {
      setFiles(data);
    }).finally(() => {
      setChildrenLoading(false);
    }).catch((err) => {
      setError("Failed to fetch data from server.");
      console.error(err);
    });

    setSelected([]);
  };

  /**
   * Update the contents of a file.
   * @param path {string} - Path to the file.
   * @param content {string} - New content to add to the file.
   * @return {any} - Server response, nothing.
   */
  const updateContent = async (path, content) => {
    const resp = await fetch(`${backendUrl}/v1/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ path, content }),
    })

    if (!resp.ok) setError("An error occurred when saving the file. Please try again.");

    const json = resp.json();
    return json;
  };

  /**
   * Download a list of files.
   * @param paths {string[]} - List of paths to download.
   * @returns void
   */
  const download = async (paths) => {
    try {
      const resp = await fetch(`${backendUrl}/v1/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ filePaths: paths }),
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

  /**
   * Fetch the content of a file.
   * @param path {string} - File content.
   * @returns {any} - Server response with content.
   */
  const fetchContent = async (path) => {
    const resp = await fetch(`${backendUrl}/v1/content?path=${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!resp.ok) setError("Something went wrong! Failed to get file content.")

    const json = await resp.json();
    return json;
  };

  /**
   * Create a file or directory.
   * @param name {string} - Name of the file or directory.
   * @param cwd {string[]} - Current directory as a list of paths.
   * @return {any} Server response.
   */
  const create = async (name, cwd) => {
    const resp = await fetch(`${backendUrl}/v1/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ name, cwd })
    });

    if (!resp.ok) {
      const data = await resp.json()
      setError(data.error);
      return data;
    }

    const json = resp.json();
    return json;
  };

  /**
   * Remove a list of files.
   * @param files {string[][]} - List of file paths as list of sub-paths.
   * @returns {any} Server response.
   */
  const remove = async (files) => {
    const resp = await fetch(`${backendUrl}/v1/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ files, root: defaultPath })
    });

    if (!resp.ok) {
      const data = await resp.json()
      setError(data.error);
      return data;
    }

    const json = await resp.json();
    return json;
  };

  const move = async (oldPath, newPath) => {
    const resp = await fetch(`${backendUrl}/v1/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPath, newPath })
    });

    if (!resp.ok) {
      const data = await resp.json()
      setError(data.error);
      return data;
    }

    const json = await resp.json();
    return json;

  }
  // ---- EFFECTS ---- //

  // Update the file list from the server each time an action requires 
  // an update.
  useEffect(() => {
    fetchFiles();
  }, [path, uploading, creating]);


  // Redirect if the user isn't logged in, otherwise update the state.
  // Store the token in the storage, it should be attached to every request.
  useEffect(() => {
    (localStorage.getItem(storage_id) == null && sessionStorage.getItem(storage_id) == null)
      ? navigate("/login")
      : updateToken();
  }, [navigate]);

  // Load the content from the file into the editor and allow the user to begin 
  // editing the file.
  useEffect(() => {
    setContentLoading(true);

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
      }).finally(() => {
        setContentLoading(false)
      });
    }

  }, [editing]);


  /**
   * This will be where the magic happens, where the files are upload
   * @param files {object[]} - List of files to upload.
   */
  const upload = (files) => {
    const uploadFiles = async (_files) => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', _files[i]); // 'files' is the field name
      }

      // Add the current path to the form data.
      // formData.append('path', "/" + path.join("/"));
      formData.append('path', JSON.stringify(path));

      const resp = await fetch(`${backendUrl}/v1/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!resp.ok) {
        const data = await resp.json()
        setError(data.error);
        return data;
      }
      return await resp.json();
    };

    if (files.length === 0) {
      setError("Cannot upload nothing. Please select files to upload.");
      return;
    }

    uploadFiles(files).then((data) => {
      if (data.code === 200) {
        setUploading(false);
      }
    });
  };

  return (
    <div className="w-full min-h-screen h-screen pb-8">
      <Navbar downloadFiles={downloadFiles} uploadFiles={toggleUploading} />
      <div className="h-full w-full flex flex-col items-center justify-center pb-8">

        {downloadLoading && <DownloadLoading />}
        {creating && <CreateDirectory close={closeCreate} create={createDirectory} />}
        {uploading && <Uploader close={toggleUploading} upload={upload} />}
        {moving && <MoveDirectory close={closeMoving} move={moveSelected} path={[...path, selected[0]]} />}

        {error && <Error error={error} clear={clearError} />}
        {
          (editing !== "" && !error) &&
          <Editor
            content={editingFileContent}
            path={editing}
            exit={exitFile}
            saveExit={exitAndSaveFile}
            loading={contentLoading}
          />
        }

        <PathDisplay
          path={path}
          updatePath={updatePath}
          backHome={backHome}
          backArrow={backArrow}
          enabled={path.length > defaultPath.length}
          create={createDir}
          remove={removeSelected}
          removeEnable={selected.length > 0}
          move={showMoving}
          moveEnabled={selected.length === 1}
        />

        <div className="w-9/10 lg:w-2/3 h-5/6 overflow-y-auto border-1 border-gray-300">
          {childrenLoading && <ChildrenLoading />}
          <DirectoryList
            dirs={files}
            showHidden={showHidden}
            appendPath={appendPath}
            toggleSelected={toggleSelected} // TODO: Rework the toggleSelected functionality
            toggleEditing={toggleEditing}
            selected={selected}
          />
        </div>

        <div className="w-9/10 lg:w-2/3 flex justify-end items-center">
          <label className="text-sm mx-2" htmlFor="showHiddenItems">Show Hidden Items</label>
          <input
            className="p-2"
            name="showHiddenItems"
            type="checkbox"
            checked={showHidden}
            onClick={toggleHidden} />
        </div>
      </div>
    </div>
  )
}
