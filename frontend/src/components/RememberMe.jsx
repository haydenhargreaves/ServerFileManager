import {useId, useState} from "react";

/**
 * Remember me button toggle button.
 * @param onChange Function which is used by the parent component.
 * @returns {JSX.Element}
 * @constructor
 */
export default function RememberMe({onChange}) {
    const [remember, setRemember] = useState(false);
    const rememberMeId = useId();

    /**
     * Toggle the value of the 'remember me' toggle.
     * It also calls the 'onChange' function which should
     * be used to store the state in the parent component.
     */
    const toggleRemember = () => {
        onChange(!remember);
        setRemember(!remember);
    };

    return <div className="w-full flex items-center my-2" onClick={toggleRemember}>
        <input name={rememberMeId} checked={remember} type="checkbox" className="mx-1"/>
        <label htmlFor={rememberMeId} className="text-sm select-none cursor-pointer">Remember me for 30 days</label>
    </div>
}