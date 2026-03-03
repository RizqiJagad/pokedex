export interface PokemonListItem {
    id: number;
    name: string;
}

export interface PokemonListResponse {
    data: PokemonListItem[];
    total: number;
    limit: number;
    skip: number;
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front: string;
        back: string;
        shiny: string;
    };
    types: string[];
    moves: string[];
    evolutionChain: string[];
}
