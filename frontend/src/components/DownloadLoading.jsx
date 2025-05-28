import "../index.css"

/**
 * Simple loading spinner for the downloads.
 * @returns {JSX.Element}
 * @constructor
 */
export default function DownloadLoading() {
  return <>
    <div className="absolute size-full flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-25 blur-lg"></div>
      <div
        className="animate-spin rounded-full border-blue-500 border-3 border-t-transparent size-6 mx-2">
      </div>
      <p className="text-lg text-black opacity-90">Preparing files...</p>
    </div>
  </>
};
