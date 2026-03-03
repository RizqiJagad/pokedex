import { PokemonListResponse, PokemonDetail } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiService = {
    getPokemons: async (limit: number = 8, skip: number = 0, search: string = ''): Promise<PokemonListResponse> => {
        const url = new URL(`${API_BASE_URL}/pokemon`);
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('skip', skip.toString());
        if (search) {
            url.searchParams.append('search', search);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch pokemons');
        }
        return response.json();
    },

    getPokemonDetail: async (name: string): Promise<PokemonDetail> => {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pokemon detail');
        }
        return response.json();
    }
};
