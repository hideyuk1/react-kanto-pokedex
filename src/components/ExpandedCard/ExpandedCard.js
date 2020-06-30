import React from 'react';
import styles from './ExpandedCard.module.css';

function ExpandedCard(props, ref) {
    const { title, image, name, description, ...buttonProps } = props;
    return (
        <button className={styles.root} ref={ref.root} {...buttonProps}>
            <span className={styles.title} ref={ref.title}>
                {title}
            </span>
            {image}
            <span className={styles.name} ref={ref.name}>
                {name}
            </span>
            <p className={styles.description}>{description}</p>
        </button>
    );
}

export default React.forwardRef(ExpandedCard);
