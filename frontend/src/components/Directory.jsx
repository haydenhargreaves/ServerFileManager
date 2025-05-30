import "../index.css"
import { useEffect, useState } from "react";

function FileIcon() {
  return <>
    <svg className="text-black h-5 mx-2" stroke="currentColor" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
}

function DirectoryIcon() {
  return <>
    <svg className="text-black h-5 mx-2" stroke="currentColor" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
}

/**
 *
 * @param name {{name: string, path: string, directory: boolean}}
 * @param showHidden {boolean}
 * @param appendPath {function(string)}
 * @param toggleSelected {function(string)}
 * @returns {{}}
 * @constructor
 */
export default function Directory({ entry, selected, showHidden, appendPath, toggleSelected, toggleEditing }) {
  const [_selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  const handleClick = () => {
    if (entry.directory) {
      appendPath(entry.name);
    } else {
      toggleEditing(entry.path);
    }
  };

  const handleCheck = () => {
    toggleSelected(entry.name);
    setSelected(!_selected);
  }

  // This is temporary, eventually I will have a real data model that stores
  // directory vs file status.
  // const isDirectory = !name.endsWith(".html");
  if (entry.name.startsWith(".") && !showHidden) {
    return <></>;
  }

  return <>
    <label className={`w-full hover:bg-gray-300 flex ${_selected ? "bg-blue-300" : "bg-gray-100"}`}>
      <input
        className="mx-2 peer checked:bg-blue-300"
        type="checkbox"
        checked={_selected}
        onChange={handleCheck} />
      <div className="w-full flex bg-gray-100 peer-checked:bg-blue-300 hover:bg-gray-300 peer-hover:bg-gray-300">
        <button className="flex items-center" onClick={handleClick}>
          {entry.directory ? <DirectoryIcon /> : <FileIcon />}
          <p className="p-2 hover:underline hover:text-blue-400">{entry.name}{entry.directory ? "/" : ""}</p>
        </button>
      </div>

    </label>
  </>
}
