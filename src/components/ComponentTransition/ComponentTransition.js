import React, { createElement, useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import styles from './ComponentTransition.module.css';

const ANIMATION_DONE_EVENT = 'animation::done';
function clearAndUpper(text) {
    return text.replace(/-/, '').toUpperCase();
}

function toCamelCase(text) {
    return text.replace(/-\w/g, clearAndUpper);
}
const triggerAnimationDoneEvent = (node) => {
    node.dispatchEvent(new Event(ANIMATION_DONE_EVENT, { cancelable: true }));
};

const transition = ({ originRef, targetRef, transitionalRef, duration }) => {
    const originRect = originRef.getBoundingClientRect();
    const targetRect = targetRef.getBoundingClientRect();
    let keyframes = getKeyframes({ originRect, targetRect });
    return transitionalRef.animate(keyframes, { duration, fill: 'both' });
};

const getKeyframes = ({ originRect, targetRect }) => {
    const translateXFrom =
        originRect.x + originRect.width / 2 - (targetRect.x + targetRect.width / 2);
    const translateYFrom =
        originRect.y + originRect.height / 2 - (targetRect.y + targetRect.height / 2);
    const scaleXFrom = originRect.width / targetRect.width;
    const scaleYFrom = originRect.height / targetRect.height;
    const from = {
        transform: `translate(${translateXFrom}px, ${translateYFrom}px) scale(${scaleXFrom}, ${scaleYFrom})`,
    };
    const to = {
        transform: 'translate(0, 0) scale(1, 1)',
    };
    return [from, to];
};

export default function ComponentTransition(props) {
    const {
        originRef,
        targetRef,
        duration = 150,
        transitionalProps,
        onEntered = () => null,
        onEnter = () => null,
        onExit = () => null,
        onExited = () => null,
    } = props;

    const [trueIn, setTrueIn] = useState(false);
    const lastTargetRef = useRef(null);
    const transitionalRef = useRef(null);
    const animationRef = useRef(null);

    const addEndListener = (done) => {
        transitionalRef.current.addEventListener(ANIMATION_DONE_EVENT, done);
    };

    const _onEnter = () => {
        if (originRef.current) originRef.current.style.visibility = 'hidden';
        animationRef.current = transition({
            originRef: originRef.current,
            targetRef: targetRef.current,
            transitionalRef: transitionalRef.current,
            duration,
        });
        animationRef.current.onfinish = () => triggerAnimationDoneEvent(transitionalRef.current);
        onEnter();
    };

    const _onEntered = () => {
        targetRef.current.style.visibility = 'visible';
        onEntered();
    };

    const _onExit = () => {
        targetRef.current.style.visibility = 'hidden';
        animationRef.current.reverse();
        onExit();
    };

    const _onExited = () => {
        if (originRef.current) originRef.current.style.visibility = 'visible';
        onExited();
    };

    useEffect(() => {
        if (targetRef?.current) lastTargetRef.current = targetRef.current;
    }, [targetRef]);

    const renderElementRef = useRef(() => null);

    useEffect(() => {
        if (targetRef.current) {
            targetRef.current.style.visibility = 'hidden';
        }
    }, [targetRef]);

    useEffect(() => {
        const cloneTarget = () => {
            const { left, top } = targetRef.current.getBoundingClientRect();
            const textChildNodes = [...targetRef.current.childNodes]
                .filter((node) => node.nodeType === Node.TEXT_NODE)
                .map((node) => node.data);
            const targetStyle = getComputedStyle(targetRef.current);
            const styleObject = [...targetStyle].reduce((acc, cssProp) => {
                acc[toCamelCase(cssProp)] = targetStyle[cssProp];
                return acc;
            }, {});

            renderElementRef.current = () => {
                return createElement(targetRef.current.tagName.toLowerCase(), {
                    ...transitionalProps,
                    ref: transitionalRef,
                    className: targetRef.current.className,
                    src: targetRef.current.src,
                    style: {
                        ...styleObject,
                        visibility: 'visible',
                        transform: 'unset',
                        position: 'fixed',
                        left,
                        top,
                    },
                    children: textChildNodes.length ? textChildNodes : undefined,
                });
            };
            lastTargetRef.current = targetRef.current;
        };

        if (props.in) cloneTarget();
        setTrueIn(props.in);
    }, [props.in, targetRef, transitionalProps]);

    return (
        <Transition
            addEndListener={addEndListener}
            in={trueIn}
            onEntered={_onEntered}
            onEnter={_onEnter}
            onExit={_onExit}
            onExited={_onExited}
            nodeRef={transitionalRef}
        >
            {(state) => {
                return (
                    <div
                        className={
                            state === 'entered' || state === 'exited' ? styles.invisible : ''
                        }
                    >
                        {renderElementRef.current()}
                    </div>
                );
            }}
        </Transition>
    );
}
