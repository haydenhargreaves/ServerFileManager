import "../index.css"

/**
 * Simple loading spinner for the text editor.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ContentLoading() {
    return (
        <div className="h-9/10 w-full flex flex-col items-center justify-center">
            <div className="flex">
                <div
                    className="animate-spin rounded-full border-blue-500 border-3 border-t-transparent size-6 mr-2 ">
                </div>
                <p className="text-lg text-black opacity-90">Content loading...</p>
            </div>
            <p className="text-xs text-gray-500 my-2">For large files, this may take a while.</p>
        </div>
    );
};
