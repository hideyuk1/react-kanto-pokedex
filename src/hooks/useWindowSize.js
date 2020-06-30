import useResizeObserver from 'hooks/useResizeObserver';
import useThrottle from 'hooks/useThrottle';
import { useState } from 'react';

export default function useWindowSize() {
    const [contentRect, setContentRect] = useState(
        document.documentElement.getBoundingClientRect(),
    );
    const throttledCallback = useThrottle({ callback: setContentRect, fps: 2 });
    useResizeObserver({
        ref: document.documentElement,
        callback: throttledCallback,
    });
    return [contentRect.width, contentRect.height];
}
