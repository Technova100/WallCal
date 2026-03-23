'use client';

import React from 'react';
import './BentoGallery.css';

const BentoGallery = () => {
    // Generate array of 16 items
    const items = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        url: `/GALLERY/1 (${i + 1}).png`,
        // Deterministic pattern for spans
        span: getSpan(i)
    }));

    function getSpan(index) {
        // Specific Layout for 16 items on a 4-column grid (Desktop) & 2-column grid (Tablet)

        // Item 0: Big feature top-left
        if (index === 0) return 'span-2x2';

        // Item 7: Wide item (reduced from 2x2)
        if (index === 7) return 'span-col-2';



        // All others standard 1x1
        return '';
    }

    return (
        <div className="bento-grid">
            {items.map((item) => (
                <div key={item.id} className={`bento-item ${item.span}`} onClick={() => window.open(item.url, '_blank')}>
                    {/* Using img tag for simple cover behavior. Next/Image requires width/height. */}
                    <img
                        src={item.url}
                        alt={`Gallery Image ${item.id}`}
                        className="bento-img"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
};

export default BentoGallery;
