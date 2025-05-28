/**
 * Takes the user back to the home directory. The onClick prop
 * is called when the button is clicked.
 * @param onClick {function}
 * @param enabled
 * @returns {JSX.Element}
 * @constructor
 */
function HomeButton({onClick, enabled}) {
  return <>
    <button
      onClick={onClick}
      disabled={!enabled}
      className="hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-150 disabled:text-gray-500 disabled:hover:bg-red-300 disabled:cursor-not-allowed text-black">
      <svg className="h-4"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor">
        <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z"/>
      </svg>
    </button>
  </>
}

function BackButton({onClick, enabled}) {
  return <>
    <button onClick={onClick}
      disabled={!enabled}
      className="hover:bg-gray-200 p-1.5 mr-1 rounded-full transition-colors duration-150 disabled:text-gray-500 disabled:hover:bg-red-300 disabled:cursor-not-allowed text-black">
      <svg className="h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z"/>
      </svg>
    </button>
  </>
}


function CreateButton({onClick}) {
  return <>
    <button onClick={onClick}
      title="Create a file/directory"
      className="hover:bg-gray-200 p-1.5 mr-1 rounded-full transition-colors duration-150 disabled:text-gray-500 disabled:hover:bg-red-300 disabled:cursor-not-allowed text-black">
      <svg className="h-5" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H10M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V10M14 21L16.025 20.595C16.2015 20.5597 16.2898 20.542 16.3721 20.5097C16.4452 20.4811 16.5147 20.4439 16.579 20.399C16.6516 20.3484 16.7152 20.2848 16.8426 20.1574L21 16C21.5523 15.4477 21.5523 14.5523 21 14C20.4477 13.4477 19.5523 13.4477 19 14L14.8426 18.1574C14.7152 18.2848 14.6516 18.3484 14.601 18.421C14.5561 18.4853 14.5189 18.5548 14.4903 18.6279C14.458 18.7102 14.4403 18.7985 14.405 18.975L14 21Z"
          stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </>
}

function DeleteButton({onClick, enabled}) {
  return <>
    <button onClick={onClick}
      disabled={!enabled}
      title="Delete selected files/directories"
      className="hover:bg-gray-200 p-1.5 mr-1 rounded-full transition-colors duration-150 disabled:text-gray-500 disabled:hover:bg-red-300 disabled:cursor-not-allowed text-black">
      <svg className="h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </>
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
  const handleClick = () => onClick(index);
  return <>
    <button onClick={handleClick}>
      /<span className="hover:underline cursor-pointer">
        {name}
      </span>
    </button>
  </>
}

/**
 * Display the path provided in the props.
 * @param path {string[]}
 * @param updatePath {function(number)}
 * @param backHome {function}
 * @param backArrow {function}
 * @param enabled {boolean}
 * @param create {function}
 * @param remove {function}
 * @param removeEnable {boolean}
 * @returns {JSX.Element}
 * @constructor
 */
export default function PathDisplay({path, updatePath, backHome, backArrow, enabled, create, remove, removeEnable}) {
  return <>
    <div className="w-9/10 lg:w-2/3 mt-8 border-b-1 border-gray-400 bg-white flex items-center truncate">
      <HomeButton onClick={backHome} enabled={enabled}/>
      <BackButton onClick={backArrow} enabled={enabled}/>
      {path.map((seg, idx) => <PathElement name={seg} key={idx} index={idx} onClick={updatePath}/>)}
      <div className="ml-auto h-full flex items-center">
        <DeleteButton onClick={remove} enabled={removeEnable}/>
      </div>
      <div className="h-full flex items-center">
        <CreateButton onClick={create}/>
      </div>
    </div>
  </>
}
