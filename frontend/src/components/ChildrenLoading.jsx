import "../index.css"

/**
 * Simple loading spinner for the directory list.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChildrenLoading() {
    return (
        <div className="size-full flex items-center justify-center">
            <div
                className="animate-spin rounded-full border-blue-500 border-3 border-t-transparent size-6 mx-2 ">
            </div>
            <p className="text-lg text-black opacity-90">Content loading...</p>
        </div>
    );
};