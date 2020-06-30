import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useResizeObserver({ callback, ref }) {
    const resizeObserverRef = useRef(null);
    const callbackRef = useRef(null);
    callbackRef.current = callback;
    const [contentRect, setContentRect] = useState(ref.getBoundingClientRect());
    const prevContentRect = useRef({});

    useEffect(() => {
        if (resizeObserverRef.current) {
            return;
        }

        resizeObserverRef.current = new ResizeObserver((entries) => {
            if (!Array.isArray(entries)) {
                return;
            }

            if (!entries.length) {
                return;
            }

            const entry = entries[0];

            const newWidth = Math.round(entry.contentRect.width);
            const newHeight = Math.round(entry.contentRect.height);

            if (
                prevContentRect.current.width !== newWidth ||
                prevContentRect.current.height !== newHeight
            ) {
                const newContentRect = entry.contentRect;
                if (callbackRef.current) {
                    callbackRef.current(newContentRect);
                } else setContentRect(newContentRect);
            }
        });
    }, []);

    useEffect(() => {
        if (typeof ref !== 'object' || ref === null) {
            return;
        }

        resizeObserverRef.current.observe(ref);
        return () => resizeObserverRef.current.unobserve(ref);
    }, [ref]);

    return contentRect;
}
