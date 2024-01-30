import React, { useEffect } from "react";
import { STATIC } from '../config';
import ErrorPopup from "../Components/ErrorPopup";
async function fetchData(url, params, setError) {
    try {
        const res = await fetch(STATIC + url, params);
        if (!res.ok) {
            const data = await res.json();
            console.log(data);
            setError(<ErrorPopup error={true} message={data.message} />);
        } else {
            return await res.json();
        }
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error:', error.message);
        setError(<ErrorPopup error={true} message={error.message} />);
        setTimeout(() => { setError(null) }, 2000);
    } finally {
        // Always remove the error after handling it
        setTimeout(() => { setError(null) }, 2000);
    }
}

export default fetchData;