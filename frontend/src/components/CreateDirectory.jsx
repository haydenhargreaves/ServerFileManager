import {useState} from "react";

/**
 * Create a file or directory, end with a / for a directory.
 * @constructor
 */
export default function CreateDirectory({close, create}) {
    const [dirName, setDirName] = useState("");

    const createDirectory = () => {
        create(dirName);
    }

    const updateDirName = (e) => {
        setDirName(e.target.value);
    }

    const closeWithoutSaving = () => {
        setDirName("");
        close();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed -inset-10 bg-black opacity-50 blur-lg"></div>
            <div className="relative z-50 bg-white p-8 rounded-lg shadow-lg w-2/5 border-1 border-gray-400">
                <h2 className="text-2xl font-semibold mb-2 text-blue-400">Create a Directory</h2>
                <p className="text-sm">
                    Create a file or directory in the current directory. To create a directory, include a <span
                    className="font-mono text-black bg-gray-300 p-1 rounded-md">/</span> at the end of the name.
                    Otherwise, the entry created will be a file.
                </p>

                <input className="border-b-2 border-blue-400 w-full p-2 my-4" type="text" name="directoryName"
                       value={dirName}
                       onInput={updateDirName}
                       placeholder="Directory name"/>
                <div className="flex justify-end">
                    <button
                        onClick={closeWithoutSaving}
                        title="Close without creating"
                        className="bg-red-500 hover:bg-red-600 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 mx-2 rounded hover:cursor-pointer">
                        Close
                    </button>
                    <button
                        onClick={createDirectory}
                        title="Create directory"
                        className="bg-blue-400 hover:bg-blue-500 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 rounded hover:cursor-pointer">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}