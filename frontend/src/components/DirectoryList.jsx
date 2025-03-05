import Directory from "./Directory.jsx";

/**
 * Display the directories in the current path.
 * @param diretories {string[]} Children of the path.
 * @param showHidden {boolean} Display hidden items.
 * @param appendPath {function(string)} Function to add a child to the path.
 * @param toggleSelected {function(string)} Function to toggle selection status.
 * @constructor
 */
export default function DirectoryList({dirs, showHidden, appendPath, toggleSelected}) {
    return (
        <>
            {dirs.map((dir) => <Directory entry={dir} showHidden={showHidden} appendPath={appendPath}
                                          toggleSelected={toggleSelected}/>)}
        </>
    )


}