import "../index.css"
import {useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Main navbar icon
 * @param height The height of the icon (h-#)
 * @returns {JSX.Element}
 * @constructor
 */
function MainIcon() {
    return <svg className="h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 9.5V15.5M12 9.5L10 11.5M12 9.5L14 11.5M8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z"
            stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
}

/**
 * Download button
 * @returns {JSX.Element}
 * @constructor
 */
function DownloadButton() {
    return (
        <button className="text-black" title="Download files">
            <svg className="hover:bg-gray-300 mx-1 transition-colors duration-200 p-1.5 rounded-full h-8"
                 viewBox="0 0 24 24" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"/>
                <path
                    d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"/>
            </svg>
        </button>
    )
}

/**
 * Upload button
 * @returns {JSX.Element}
 * @constructor
 */
function UploadButton() {
    return (
        <button className="text-black" title="Upload files">
            <svg className="hover:bg-gray-300 mx-1 transition-colors duration-200 p-1.5 rounded-full font-semibold h-8"
                 viewBox="0 0 24 24" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"/>
                <path
                    d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"/>
            </svg>
        </button>
    )
}

/**
 * Information button. Not sure what this is going to do...
 * @returns {JSX.Element}
 * @constructor
 */
function InfoButton() {
    return (
        <button className="text-black" title="Filesystem information">
            <svg className="hover:bg-gray-300 mx-1 transition-colors duration-200 p-1.5 rounded-full font-semibold h-8"
                 viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"/>
                <path
                    d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"/>
            </svg>
        </button>
    )
}


/**
 * Logout button, which clears the user from the storage's.
 * @returns {JSX.Element}
 * @constructor
 */
function LogoutButton() {
    const navigate = useNavigate();

    /**
     * The name of the value stored in local storage.
     * @type {string}
     */
    const storage_id = "gophernest_credentials";

    const handleClick = () => {
        localStorage.removeItem(storage_id);
        sessionStorage.removeItem(storage_id);
        navigate("/login");
    };

    return (
        <button className="text-red-500" title="Logout" onClick={handleClick}>
            <svg
                className="text-red-500 hover:bg-red-200 mx-1 transition-colors duration-200 p-1.5 rounded-full font-semibold h-8"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    )
}

/**
 * Search bar input, with controlled state.
 * @returns {JSX.Element}
 * @constructor
 */
function SearchBar() {
    const [search, setSearch] = useState("");

    /**
     * Update the controlled state.
     * @param event {InputEvent}
     */
    const updateSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className="mx-4 w-1/4">
            <input
                className="px-2 py-1 w-full text-sm focus:outline-none focus:shadow-sm shadow-blue-300 transition-shadow duration-200 rounded-sm border-1 border-gray-400"
                type="search"
                value={search}
                onInput={updateSearch}
                placeholder="Search filesystem"/>
        </div>
    )
}

export default function Navbar() {
    return <nav className="absolute w-full p-2 flex items-center border-b-1 border-gray-400 bg-gray-100">
        <MainIcon/>

        <h3 className="text-xl font-mono px-3">file.gophernest.net</h3>
        <SearchBar/>

        <div className="min-h-fit ml-auto flex">
            <DownloadButton/>
            <UploadButton/>
            <InfoButton/>
            <LogoutButton/>
        </div>
    </nav>
}