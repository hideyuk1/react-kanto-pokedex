import React, { useEffect, useState } from 'react';
import styles from './CardButton.module.css';

function CardButton(props, ref) {
    const [isVisible, setIsVisible] = useState(false);
    const { children, className } = props;
    useEffect(() => {
        const current = ref.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { root: null, rootMargin: '0px', threshold: 0 },
        );
        observer.observe(current);
        return () => observer.unobserve(current);
    }, [ref]);

    return (
        <button className={`${styles.root} ${className}`} ref={ref} {...props}>
            {isVisible ? children : null}
        </button>
    );
}

export default React.forwardRef(CardButton);
