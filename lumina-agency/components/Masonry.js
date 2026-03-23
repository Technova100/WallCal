'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
    const get = () => {
        if (typeof window === 'undefined') return defaultValue;
        const index = queries.findIndex(q => window.matchMedia(q).matches);
        return index !== -1 ? values[index] : defaultValue;
    };

    const [value, setValue] = useState(get);

    useEffect(() => {
        const handler = () => setValue(get);
        queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
    }, [queries]);

    return value;
};

const useMeasure = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size];
};

const preloadImages = async urls => {
    await Promise.all(
        urls.map(
            src =>
                new Promise(resolve => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
                    img.onerror = () => resolve({ src, width: 1, height: 1 });
                })
        )
    ).then(results => {
        return results.reduce((acc, curr) => {
            acc[curr.src] = curr;
            return acc;
        }, {});
    });
};

const Masonry = ({
    items,
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    scaleOnHover = true,
    hoverScale = 0.98,
    blurToFocus = true,
    colorShiftOnHover = false
}) => {
    const columns = useMedia(
        ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
        [5, 4, 3, 2],
        2
    );

    const [containerRef, { width }] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);
    const [imageDims, setImageDims] = useState({});
    const [containerHeight, setContainerHeight] = useState(0);

    const getInitialPosition = (item) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return { x: item.x, y: item.y };

        let direction = animateFrom;

        if (animateFrom === 'random') {
            const directions = ['top', 'bottom', 'left', 'right'];
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        switch (direction) {
            case 'top': return { x: item.x, y: -200 };
            case 'bottom': return { x: item.x, y: 500 };
            case 'left': return { x: -200, y: item.y };
            case 'right': return { x: window.innerWidth + 200, y: item.y };
            default: return { x: item.x, y: item.y + 100 };
        }
    };

    useEffect(() => {
        if (items && items.length > 0) {
            const loadImages = async () => {
                const urls = items.map(i => i.img);
                const results = await Promise.all(
                    urls.map(src => new Promise(resolve => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
                        img.onerror = () => resolve({ src, width: 1, height: 1 });
                    }))
                );

                const dims = results.reduce((acc, curr) => {
                    acc[curr.src] = curr;
                    return acc;
                }, {});

                setImageDims(dims);
                setImagesReady(true);
            };
            loadImages();
        }
    }, [items]);

    const grid = useMemo(() => {
        if (!width || !items || items.length === 0 || !imagesReady) return [];

        const colHeights = new Array(columns).fill(0);
        const columnWidth = width / columns;

        const computedGrid = items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = columnWidth * col;

            // Calculate height based on actual aspect ratio if available
            const dim = imageDims[child.img];
            let height = child.height / 2; // Fallback to prop

            if (dim && dim.width > 0) {
                // Aspect Ratio = H / W
                // New Height = New Width * (H / W)
                // New Width = columnWidth
                height = columnWidth * (dim.height / dim.width);
            }

            const y = colHeights[col];

            colHeights[col] += height;

            return { ...child, x, y, w: columnWidth, h: height };
        });

        setContainerHeight(Math.max(...colHeights));
        return computedGrid;

    }, [columns, items, width, imagesReady, imageDims]);

    const hasMounted = useRef(false);

    useLayoutEffect(() => {
        if (!imagesReady || grid.length === 0) return;

        grid.forEach((item, index) => {
            const selector = `[data-key="${item.id}"]`;
            const animationProps = {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
                opacity: 1,
                ...(blurToFocus && { filter: 'blur(0px)' })
            };

            if (!hasMounted.current) {
                const initialPos = getInitialPosition(item);
                const initialState = {
                    opacity: 0,
                    x: initialPos.x,
                    y: initialPos.y,
                    width: item.w,
                    height: item.h,
                    ...(blurToFocus && { filter: 'blur(10px)' })
                };

                gsap.fromTo(selector, initialState, {
                    ...animationProps,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: index * stagger
                });
            } else {
                gsap.to(selector, {
                    ...animationProps,
                    duration: duration,
                    ease: ease,
                    overwrite: 'auto'
                });
            }
        });

        hasMounted.current = true;
    }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

    const handleMouseEnter = (e, item) => {
        const element = e.currentTarget;
        const selector = `[data-key="${item.id}"]`;

        if (scaleOnHover) {
            gsap.to(selector, {
                scale: hoverScale,
                duration: 0.3,
                ease: 'power2.out',
                zIndex: 10
            });
        }

        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0.3,
                    duration: 0.3
                });
            }
        }
    };

    const handleMouseLeave = (e, item) => {
        const element = e.currentTarget;
        const selector = `[data-key="${item.id}"]`;

        if (scaleOnHover) {
            gsap.to(selector, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                zIndex: 1
            });
        }

        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3
                });
            }
        }
    };

    return (
        <div ref={containerRef} className="list" style={{ minHeight: containerHeight > 0 ? containerHeight : '100vh' }}>
            {grid.map(item => {
                return (
                    <div
                        key={item.id}
                        data-key={item.id}
                        className="item-wrapper"
                        onClick={() => window.open(item.url, '_blank', 'noopener')}
                        onMouseEnter={e => handleMouseEnter(e, item)}
                        onMouseLeave={e => handleMouseLeave(e, item)}
                    >
                        <div className="item-img" style={{ backgroundImage: `url(${item.img})`, backgroundSize: 'cover' }}>
                            {colorShiftOnHover && (
                                <div
                                    className="color-overlay"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        borderRadius: '8px'
                                    }}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Masonry;
