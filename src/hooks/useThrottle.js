import { useCallback, useEffect, useRef } from 'react';

export default function useThrottle({ callback, fps = 30, leading = false }) {
    const storedCallback = useRef(callback);
    const ms = 1000 / fps;
    const prev = useRef(0);
    const trailingTimeout = useRef();
    const clearTrailing = () => trailingTimeout.current && clearTimeout(trailingTimeout.current);

    // Reset any time the deps change
    useEffect(
        () => () => {
            prev.current = 0;
            clearTrailing();
        },
        [fps, leading, storedCallback],
    );

    return useCallback(
        (...args) => {
            const rightNow = Date.now();
            const call = () => {
                prev.current = rightNow;
                clearTrailing();
                storedCallback.current(...args);
            };
            const current = prev.current;
            // leading
            if (leading && current === 0) return call();
            // body
            if (rightNow - current > ms) {
                if (current > 0) return call();
                prev.current = rightNow;
            }
            // trailing
            clearTrailing();
            trailingTimeout.current = setTimeout(() => {
                call();
                prev.current = 0;
            }, ms);
        },
        [leading, storedCallback, ms],
    );
}
