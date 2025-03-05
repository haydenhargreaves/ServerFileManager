/**
 * Takes the user back to the home directory. The onClick prop
 * is called when the button is clicked.
 * @param onClick {function}
 * @returns {JSX.Element}
 * @constructor
 */
function HomeButton({onClick}) {
    return (
        <button
            onClick={onClick}
            className="hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-150">
            <svg className="text-black h-4"
                 viewBox="0 0 16 16"
                 xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor">
                <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z"/>
            </svg>
        </button>
    )
}

function BackButton({onClick}) {
    return (
        <button onClick={onClick}
                className="hover:bg-gray-200 p-1.5 mr-1 rounded-full transition-colors duration-150">
            <svg className="h-5 text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z"/>
            </svg>
        </button>
    )
}

/**
 *
 * @param name {string}
 * @param index {number}
 * @param onClick {function}
 * @returns {JSX.Element}
 * @constructor
 */
function PathElement({name, index, onClick}) {
    const handleClick = () => {
        onClick(index);
    };
    return <button onClick={handleClick}>/<span className="hover:underline cursor-pointer">{name}</span></button>
}

/**
 * Display the path provided in the props.
 * @param path {string[]}
 * @param updatePath {function(number)}
 * @param backHome {function}
 * @param backArrow {function}
 * @returns {JSX.Element}
 * @constructor
 */
export default function PathDisplay({path, updatePath, backHome, backArrow}) {
    return (
        <div
            className="w-2/3 mt-8 border-b-1 border-gray-400 bg-white flex items-center truncate">
            <HomeButton onClick={backHome}/>
            <BackButton onClick={backArrow}/>
            {path.map((seg, idx) => <PathElement name={seg} key={idx} index={idx} onClick={updatePath}/>)}
        </div>
    )
}