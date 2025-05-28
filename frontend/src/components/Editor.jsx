import { useEffect, useRef, useState } from "react";
import ContentLoading from "./ContentLoading.jsx";

export default function Editor({ content, path, exit, saveExit, loading }) {
  const [text, setText] = useState("");
  /**
     * Store a reference to the text area object
     * @type {React.RefObject<null>}
     */
  const textareaRef = useRef(null);

  const updateText = (event) => setText(event.target.value);

  useEffect(() => {
    setText(content);
  }, [content])

  const handleKeyPress = (event) => {
    // Override tab changing focus
    // Uses 2 space indents
    // TODO: Allow toggle for two and four space indents
    if (event.key === "Tab") {
      event.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Insert tab character
      // Update textarea value and cursor position
      textarea.value = value.substring(0, start) + "  " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2; // Move the cursor after the tab

      // Trigger a change event so React knows the value changed.
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  /**
     * Call the parent function with the new content which is
     * stored in the text state.
     */
  const saveAndExit = () => saveExit(text);

  return <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blured backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 blur-lg"></div>

      <div className="w-9/10 lg:w-3/4 h-5/6 relative z-10 bg-white p-4 lg:p-8 rounded-lg shadow-lg border-1 border-gray-400 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-blue-400">
          Editing File: <span className="font-mono text-black bg-gray-300 p-1 rounded-md">
            {path}
          </span>
        </h2>
        {loading && <ContentLoading />}
        {loading ||
          <textarea
            onKeyDown={handleKeyPress}
            tabIndex={-1}
            ref={textareaRef}
            onInput={updateText}
            value={text}
            className="border-1 border-gray-300 rounded-md w-full flex-grow p-1 resize-none text-sm font-mono">
          </textarea>
        }
        <div className="flex justify-end mt-4">
          <button
            title="Exit without saving"
            onClick={exit}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded hover:cursor-pointer mx-2">
            Exit
          </button>
          <button
            title="Save changes and exit"
            onClick={saveAndExit}
            className="bg-blue-400 hover:bg-blue-500 text-white text-sm font-semibold py-1.5 px-3 rounded hover:cursor-pointer">
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  </>
}
