import useOutsideClick from 'hooks/useOutsideClick';
import useViewportUnits from 'hooks/useViewportUnits';
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';
import { Transition } from 'react-transition-group';
import styles from './FloatingSearch.module.css';

function FloatingSearch(props, ref) {
    const { value, onChange } = props;
    const { vw } = useViewportUnits();
    const [expanded, setExpanded] = useState(false);
    const [entered, setEntered] = useState(false);

    // control element transform
    const [translateX, setTranslateX] = useState(0);
    const inputRef = useRef(null);

    // store element refs and animation refs
    const refs = useMemo(() => {
        return ['wrapper', 'icon', 'left', 'middle', 'right'].reduce((acc, key) => {
            acc[key] = {
                ref: createRef(),
                animationRef: createRef(),
            };
            return acc;
        }, {});
    }, []);

    useOutsideClick(refs.wrapper.ref, () => setExpanded(false));

    const getDistanceToXCenter = (ref) => {
        if (ref.current) {
            const wrapperCoord = ref.current.getBoundingClientRect();
            const wrapperOriginX = wrapperCoord.x + wrapperCoord.width / 2;
            const screenCenterX = window.innerWidth / 2;
            return screenCenterX - wrapperOriginX;
        }
        return 0;
    };

    // recenter
    useEffect(() => {
        if (!entered) return;
        if (expanded) {
            const distanceToXCenter = getDistanceToXCenter(refs.wrapper.ref);
            setTranslateX((prev) => prev + distanceToXCenter);
            // _onEnter();
        }
    }, [vw, expanded, entered, refs.wrapper.ref]);

    const _onEnter = () => {
        setTranslateX(getDistanceToXCenter(refs.wrapper.ref));
    };

    const _onEntered = () => {
        setEntered(true);
        inputRef.current.focus();
    };

    const _onExit = () => {
        setEntered(false);
        setTranslateX(0);
    };

    const _onExited = () => {};

    const onEnterPressed = (e) => {
        // if enter pressed
        if (e.keyCode === 13) setExpanded((prev) => !prev);
    };

    // prevent closing button
    const onSpacePressed = (e) => {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    };

    // bind enter to search button
    useEffect(() => {
        document.addEventListener('keydown', onEnterPressed);
        return () => document.removeEventListener('keydown', onEnterPressed);
    }, []);

    return (
        <>
            <Transition
                addEndListener={(done) => {
                    refs.wrapper.ref.current.addEventListener('transitionend', done, false);
                }}
                in={expanded}
                onEnter={_onEnter}
                onEntered={_onEntered}
                onExit={_onExit}
                onExited={_onExited}
                nodeRef={refs.wrapper.ref}
            >
                {(state) => (
                    <button
                        ref={refs.wrapper.ref}
                        className={styles.buttonRoot}
                        style={{
                            transform: `translateX(${translateX}px)`,
                        }}
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        <div
                            className={`${styles.left} ${expanded ? styles.leftTranslated : ''}`}
                        />
                        <div
                            className={`${styles.middle} ${expanded ? styles.middleExpanded : ''}`}
                        />
                        <div
                            className={`${styles.right} ${expanded ? styles.rightTranslated : ''}`}
                        />
                        <div className={styles.iconWrapper}>
                            <div
                                className={`${styles.iconTransformWrapper} ${
                                    expanded ? styles.leftTranslated : undefined
                                }`}
                            >
                                <SearchIcon />
                            </div>
                        </div>
                        <input
                            placeholder={'Search'}
                            className={`${styles.search} ${
                                state === 'entered' ? undefined : styles.invisible
                            }`}
                            ref={inputRef}
                            onClick={(e) => e.stopPropagation()}
                            value={value}
                            onChange={onChange}
                            onKeyUp={onSpacePressed}
                        />
                    </button>
                )}
            </Transition>
        </>
    );
}

export default React.forwardRef(FloatingSearch);
