import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './ExpandedCard.module.css';

function ExpandedCard(props, ref) {
    const { title, image, name, description, onCloseButtonClick, ...rootProps } = props;
    return (
        <div className={styles.root} ref={ref.root} {...rootProps}>
            <span className={styles.title} ref={ref.title}>
                {title}
            </span>
            {image}
            <span className={styles.name} ref={ref.name}>
                {name}
            </span>
            <p className={styles.description}>{description}</p>
            <button onClick={onCloseButtonClick} className={styles.closeButton}>
                <FiX />
            </button>
        </div>
    );
}

export default React.forwardRef(ExpandedCard);
