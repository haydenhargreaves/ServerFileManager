import "../index.css";

/**
 * Basic error modal
 * @param error The error message
 * @param clear Clear error function from parent
 * @returns {JSX.Element}
 * @constructor
 */
export default function Error({error, clear}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50 blur-lg"></div>
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96 border-1 border-gray-400">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">An Error Occurred!</h2>
                <p className="mb-4">{error}</p>
                <div className="flex justify-end">
                    <button
                        onClick={clear}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded hover:cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}