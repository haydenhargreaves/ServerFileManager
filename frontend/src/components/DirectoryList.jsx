import Directory from "./Directory.jsx";

/**
 * Display the directories in the current path.
 * @param diretories {string[]} - Children of the path.
 * @param showHidden {boolean} - Display hidden items.
 * @param appendPath {function(string)} - Function to add a child to the path.
 * @param toggleSelected {function(string)} - Function to toggle selection status.
 * @param selected {string[]} - List of selected names.
 * @constructor
 */
export default function DirectoryList({ dirs, showHidden, appendPath, toggleSelected, toggleEditing, selected }) {

  return <>
    {dirs.map((dir, idx) =>
      <Directory
        key={idx}
        entry={dir}
        selected={selected.includes(dir.name)}
        showHidden={showHidden}
        appendPath={appendPath}
        toggleSelected={toggleSelected}
        toggleEditing={toggleEditing} />
    )}
  </>
}
