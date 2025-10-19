import React, { useEffect, useState } from 'react';

const OriginalUrl = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(true);

    useEffect(() => {
        // Extract the original_url parameter from the URL query string
        const urlParams = new URLSearchParams(window.location.search);
        const original_url = urlParams.get('original_url');

        if (original_url) {
            try {
                let url = new URL(original_url);
                setOriginalUrl(url.href);
            } catch (error) {
                // If there is an error parsing the URL, assume it's a relative URL or a typo and prepend "https://"
                setOriginalUrl(`https://${original_url}`);
            }
        } else {
            setIsUrlValid(false);
        }
    }, []);

    const handleButtonClick = () => {
        window.location.href = originalUrl;
    };

    if (!isUrlValid) {
        return null;
    }

    return (
        <div className="my-4">
            <button onClick={handleButtonClick} className="bg-red hover:bg-dark-red text-white font-bold py-2 px-4 rounded">
                Refresh Access Application
            </button>
        </div>
    );
};

export default OriginalUrl;
