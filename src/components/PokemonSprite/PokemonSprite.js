import React from 'react';
import styles from './PokemonSprite.module.css';
import pokedexJson from 'assets/data/pokedex.json';

function PokemonSprite({ pokedexNumber = null, className = '', ...otherProps }, ref) {
    if (pokedexNumber === null) return null;
    const src = pokedexNumber === null ? '' : require(`assets/sprites/${pokedexNumber}.png`);
    return (
        <img
            className={`${styles.sprite} ${className}`}
            ref={ref}
            src={src}
            alt={pokedexJson[pokedexNumber - 1].name}
            {...otherProps}
        />
    );
}

export default React.forwardRef(PokemonSprite);
