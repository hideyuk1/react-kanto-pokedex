import pokedexJson from 'assets/data/pokedex.json';
import CardButton from 'components/CardButton/CardButton';
import ComponentTransition from 'components/ComponentTransition/ComponentTransition';
import ExpandedCard from 'components/ExpandedCard/ExpandedCard';
import PokemonSprite from 'components/PokemonSprite/PokemonSprite';
import React, { createRef, useMemo, useRef, useState } from 'react';
import { disableScroll, enableScroll } from 'utils/scroll';
import styles from './PokemonGrid.module.css';

export default function PokemonGrid(props) {
    const {
        setSelectedPokemonId,
        selectedPokemonId,
        cardWidth,
        filterFunction,
        className = '',
    } = props;
    const [selected, setSelected] = useState(false);
    const selectPokemon = (id) => {
        setSelectedPokemonId(id);
    };
    const expandedCardRef = useRef(null);
    const expandedSpriteRef = useRef(null);
    const expandedPokedexId = useRef(null);
    const expandedPokemonName = useRef(null);

    const refs = useMemo(() => {
        return pokedexJson.reduce((acc, entry) => {
            acc[entry.pkdx_id] = {
                card: createRef(),
                title: createRef(),
                sprite: createRef(),
                name: createRef(),
            };
            return acc;
        }, {});
    }, []);

    const animateSpriteOnMountCallbackRefs = useMemo(() => {
        return pokedexJson.reduce((acc, entry) => {
            acc[entry.pkdx_id] = (node) => {
                if (!node) return;
                if (node !== null) {
                    node.animate(
                        [
                            { opacity: 0, transform: 'translateY(10%)' },
                            { opacity: 1, transform: 'translateY(0%)' },
                        ],
                        { duration: 200 },
                    );
                }
                refs[entry.pkdx_id].sprite.current = node;
            };
            return acc;
        }, {});
    }, [refs]);

    const selectedRef = useMemo(() => refs[selectedPokemonId], [selectedPokemonId, refs]);

    return (
        <div className={`${styles.grid} ${className}`}>
            {pokedexJson.filter(filterFunction).map((entry, index) => (
                <CardButton
                    key={entry.pkdx_id}
                    onClick={() => {
                        if (selected) {
                            setSelected(false);
                        } else {
                            setSelected(true);
                            selectPokemon(entry.pkdx_id);
                        }
                    }}
                    id={entry.pkdx_id}
                    ref={refs[entry.pkdx_id].card}
                    height={cardWidth}
                    width={cardWidth}
                >
                    <span ref={refs[entry.pkdx_id].title}>{entry.pkdx_id}</span>
                    <PokemonSprite
                        pokedexNumber={entry.pkdx_id}
                        ref={animateSpriteOnMountCallbackRefs[entry.pkdx_id]}
                    />
                    <span ref={refs[entry.pkdx_id].name}>{entry.name}</span>
                </CardButton>
            ))}

            <ComponentTransition
                in={selected}
                originRef={selectedRef?.card}
                targetRef={expandedCardRef}
                transitionalProps={{
                    onClick: () => setSelected(false),
                }}
                onEnter={() => disableScroll()}
                onExited={() => enableScroll()}
            />
            <ComponentTransition
                in={selected}
                originRef={selectedRef?.sprite}
                targetRef={expandedSpriteRef}
            />
            <ComponentTransition
                in={selected}
                originRef={selectedRef?.title}
                targetRef={expandedPokedexId}
            />
            <ComponentTransition
                in={selected}
                originRef={selectedRef?.name}
                targetRef={expandedPokemonName}
            />
            <ExpandedCard
                ref={{
                    root: expandedCardRef,
                    title: expandedPokedexId,
                    name: expandedPokemonName,
                }}
                onCloseButtonClick={() => {
                    setSelected(false);
                }}
                title={selectedPokemonId}
                image={
                    <PokemonSprite
                        pokedexNumber={selectedPokemonId || 1}
                        ref={expandedSpriteRef}
                        className={styles.expandedSprite}
                    />
                }
                name={pokedexJson[selectedPokemonId - 1]?.name}
                description={pokedexJson[selectedPokemonId - 1]?.description}
            />
        </div>
    );
}
