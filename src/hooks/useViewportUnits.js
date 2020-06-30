import useWindowSize from 'hooks/useWindowSize';
import { useMemo } from 'react';

export default function useViewportUnits() {
    const [width, height] = useWindowSize();
    const viewportUnits = useMemo(() => {
        const vw = width / 100;
        const vh = height / 100;
        const vmin = Math.min(vw, vh);
        const vmax = Math.max(vw, vh);
        return { vw, vh, vmin, vmax };
    }, [width, height]);

    return viewportUnits;
}
