import { useState, useEffect } from "react";

/**
 * Move a file or directory.
 * @constructor
 */
export default function MoveDirectory({ close, move, path }) {
  const [dirName, setDirName] = useState("");

  useEffect(() => {
    setDirName("/" + path.join("/"));
  }, [path]);

  const moveDirectory = () => move(dirName);
  const updateDirName = (e) => setDirName(e.target.value);

  const closeWithoutSaving = () => {
    setDirName("");
    close();
  }

  return <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blured backdrop */}
      <div className="fixed -inset-10 bg-black opacity-50 blur-lg"></div>

      <div className="relative z-50 bg-white p-8 rounded-lg shadow-lg w-9/10 lg:w-2/5 border-1 border-gray-400">
        <h2 className="text-2xl font-semibold mb-2 text-blue-400">
          Move/Rename Directory
        </h2>
        <p className="text-sm">
          Move a file or directory from the current directory to a new location. This can be used to rename files
          if the base directory remains the same.
        </p>

        <input className="border-b-2 border-blue-400 w-full p-2 my-4" type="text" name="directoryName"
          value={dirName}
          onInput={updateDirName}
          placeholder="Directory name" />
        <div className="flex justify-end">
          <button
            onClick={closeWithoutSaving}
            title="Close without creating"
            className="bg-red-500 hover:bg-red-600 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 mx-2 rounded hover:cursor-pointer">
            Close
          </button>
          <button
            onClick={moveDirectory}
            title="Move directory"
            className="bg-blue-400 hover:bg-blue-500 duration-100 text-white text-sm font-semibold py-1.5 px-3 mt-2 rounded hover:cursor-pointer">
            Move
          </button>
        </div>
      </div>
    </div>
  </>
}
