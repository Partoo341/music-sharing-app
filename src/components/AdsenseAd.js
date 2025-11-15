import React, { useEffect } from 'react';

const AdSenseAd = ({ slot, format = "auto" }) => {
    useEffect(() => {
        // Initialize ad after component mounts
        if (window.adsbygoogle) {
            window.adsbygoogle.push({});
        }
    }, []);

    return (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-7910564262073474"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            >
            </ins>
        </div>
    );
};

export default AdSenseAd;