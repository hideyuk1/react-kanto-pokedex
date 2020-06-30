import styles from 'App.module.css';
import FloatingSearch from 'components/FloatingSearch.js/FloatingSearch';
import PokemonGrid from 'components/PokemonGrid/PokemonGrid';
import 'global.module.css';
import React, { useCallback, useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import 'typeface-spartan';
import 'web-animations-js';

function App() {
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const filterFunction = useCallback(
        (pokedexEntry) => pokedexEntry.name.toLowerCase().includes(searchInput.toLowerCase()),
        [searchInput],
    );

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Kanto Pokedex</h1>
            <a
                className={styles.githubLink}
                target="_blank"
                href="https://github.com/hideyuk1/react-kanto-pokedex"
                rel="noopener noreferrer"
            >
                <FiGithub />
            </a>
            <PokemonGrid
                selectedPokemonId={selectedPokemonId}
                setSelectedPokemonId={setSelectedPokemonId}
                filterFunction={filterFunction}
            />
            <FloatingSearch value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </main>
    );
}

export default App;
