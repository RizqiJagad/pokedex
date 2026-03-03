import { Request, Response } from 'express';
import Pokemon from '../models/Pokemon';

export const getPokemons = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 8;
        const skip = parseInt(req.query.skip as string) || 0;
        const search = req.query.search as string || '';

        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const pokemons = await Pokemon.find(query)
            .sort({ id: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Pokemon.countDocuments(query);

        res.json({
            data: pokemons,
            total,
            limit,
            skip
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getPokemonDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        let pokemon = await Pokemon.findOne({ name: name.toLowerCase() });

        if (!pokemon) {
            res.status(404).json({ message: 'Pokemon not found in DB' });
            return;
        }

        // Check if fully populated
        if (!pokemon.height) {
            console.log(`Fetching detail from PokeAPI for ${name}...`);

            try {
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
                if (!pokeRes.ok) {
                    res.status(404).json({ message: 'Failed to fetch from PokeAPI' });
                    return;
                }
                const pokeData = await pokeRes.json();

                // Fetch species to get evolution chain
                const speciesRes = await fetch(pokeData.species.url);
                const speciesData = await speciesRes.json();

                // Fetch evolution chain
                const evoRes = await fetch(speciesData.evolution_chain.url);
                const evoData = await evoRes.json();

                // Parse evolution tree
                const evolutions: string[] = [];
                const traverse = (node: any) => {
                    evolutions.push(node.species.name);
                    node.evolves_to.forEach((child: any) => traverse(child));
                };
                traverse(evoData.chain);

                // Update pokemon object
                pokemon.height = pokeData.height;
                pokemon.weight = pokeData.weight;
                pokemon.sprites = {
                    front: pokeData.sprites.front_default || '',
                    back: pokeData.sprites.back_default || '',
                    shiny: pokeData.sprites.front_shiny || ''
                };
                pokemon.types = pokeData.types.map((t: any) => t.type.name);

                // Limit to 10 moves
                pokemon.moves = pokeData.moves.slice(0, 10).map((m: any) => m.move.name);

                pokemon.evolutionChain = evolutions;

                // Save to DB
                await pokemon.save();
            } catch (fetchError) {
                console.error('Error fetching deep details from PokeAPI', fetchError);
                res.status(500).json({ message: 'Failed fetching deep details from PokeAPI' });
                return;
            }
        }

        res.json(pokemon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
