import "../index.css"
import {useRef, useState} from "react";

/**
 * The list of files that the user is attempting to upload.
 * @param files {object[]}
 * @returns {JSX.Element}
 * @constructor
 */
function FileList({files}) {
    return (
        <ul className="text-xs overflow-auto max-h-[200px] italic">
            {files.map((file) => <li className="py-0.5">{file.name}</li>)}
        </ul>
    );
}

export default function Uploader({close, upload}) {
    const [files, setFiles] = useState([]);

    /**
     * References to the elements.
     * @type {React.RefObject<null>}
     */
    const inputElement = useRef(null);

    /**
     * Prevent the default drag behavior and apply visual classes.
     * @param e {object} Event object from the div wrapper.
     */
    const dragEnter = (e) => {
        e.preventDefault();
        e.target.classList.add('border-blue-500', 'bg-blue-100');
    };

    /**
     * Prevent the default drag behavior and apply visual classes.
     * @param e {object} Event object from the div wrapper.
     */
    const dragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove('border-blue-500', 'bg-blue-100');
    };

    /**
     * Prevent the default drag behavior.
     * @param e {object} Event object from the div wrapper.
     */
    const dragOver = (e) => {
        e.preventDefault();
    };

    /**
     * When files are dropped into the div, this will be called, to append the files.
     * @param e {object} Event object from the div wrapper.
     */
    const drop = (e) => {
        e.preventDefault();
        e.target.classList.remove('border-blue-500', 'bg-blue-100');
        setFiles([...files, ...e.dataTransfer.files]);
    };

    /**
     * Click event for the input element.
     * Uses the ref hook to access the element.
     */
    const click = () => {
        inputElement.current.click();
    };

    /**
     * When the input changes, append the new files.
     * @param e {object} Event object from the input.
     */
    const inputChange = (e) => {
        setFiles([...files, ...e.target.files]);
    };

    const uploadFiles = () => {
        upload(files);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed -inset-10 bg-black opacity-50 blur-lg"></div>
            <div className="relative z-50 bg-white p-8 rounded-lg shadow-lg w-2/5 border-1 border-gray-400">
                <h2 className="text-2xl font-semibold mb-2 text-blue-400">Upload Files</h2>
                <p className="text-sm">
                    Files uploaded will be added to the current directory. Currently, directory
                    uploads are not supported. If you want to upload a directory you can create a new one and upload the
                    files into it.
                </p>
                <div
                    className="my-5 border-2 border-dashed p-8 rounded-md text-center cursor-pointer border-gray-400 hover:bg-blue-100 hover:border-blue-500 transition-all duration-100"
                    onDragEnter={dragEnter} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={drop} onClick={click}
                >
                    <input multiple type="file" className="hidden" ref={inputElement} onChange={inputChange}/>
                    <p className="italic">Drag and drop files here or click to select</p>
                </div>
                <FileList files={files}/>
                <div className="flex justify-end">
                    <button
                        onClick={close}
                        title="Close without uploading"
                        className="bg-red-500 hover:bg-red-600 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 mx-2 rounded hover:cursor-pointer">
                        Close
                    </button>
                    <button
                        onClick={uploadFiles}
                        title="Upload times"
                        className="bg-blue-400 hover:bg-blue-500 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 rounded hover:cursor-pointer">
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}