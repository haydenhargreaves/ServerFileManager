import "../index.css"

export default function NotFound() {
  return <>
    <div className="min-h-screen h-screen w-full bg-gray-200 flex items-center justify-center">
      <div className="w-2/7 h-fit bg-white border-1 rounded-sm border-gray-300 p-12">
        <h1 className="text-6xl font-semibold mt-2 mb-12 opacity-50 text-gray-400"> 404 </h1>
        <p className="text-sm text-black"> This page could not be found or does not exist.</p>
      </div>
    </div>
  </>
}
