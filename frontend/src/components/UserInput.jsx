import {useId, useState} from "react";
import "../index.css"

/**
 * The email input element. A unique ID is generated. This element will
 * fill the entire width of its parent. (w-full)
 * @param {onChange}
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserInput({onChange}) {
    // Example of the controlled input state pattern
    const [email, setEmail] = useState("");

    // Generate ID for the input element
    const id = useId();

    /**
     * Update the password controlled state
     * @param event {InputEvent}
     */
    const updateEmail = (event) => {
        const email = event.target.value;
        setEmail(email);
        onChange(email);
    }

    return <input
        type="text"
        name={id}
        value={email}
        onChange={updateEmail}
        placeholder="Username"
        required={true}
        className="border border-gray-300 rounded-sm py-2 px-4 placeholder:italic w-full my-2"
    />
}