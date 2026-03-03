import Pokemon from '../models/Pokemon';

export const seedPokemonsIfEmpty = async () => {
    try {
        const count = await Pokemon.countDocuments();
        if (count === 0) {
            console.log('Seeding initial Pokemon list from PokeAPI...');
            // Fetch 1302 Pokemons to have a comprehensive list for search & infinite scroll
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
            const data = await response.json();

            const pokemons = data.results.map((p: any) => {
                const urlParts = p.url.split('/');
                // The URL format is always like https://pokeapi.co/api/v2/pokemon/1/
                const id = parseInt(urlParts[urlParts.length - 2], 10);
                return {
                    id,
                    name: p.name
                };
            });

            await Pokemon.insertMany(pokemons);
            console.log('Database seeded with', pokemons.length, 'pokemons!');
        }
    } catch (err) {
        console.error('Failed to seed DB', err);
    }
};
