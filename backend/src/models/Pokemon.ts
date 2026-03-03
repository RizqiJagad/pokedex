import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
    id: number;
    name: string;
    height?: number;
    weight?: number;
    sprites?: {
        front: string;
        back: string;
        shiny: string;
    };
    types?: string[];
    moves?: string[];
    evolutionChain?: string[];
}

const PokemonSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true, index: true },
    height: { type: Number },
    weight: { type: Number },
    sprites: {
        front: { type: String },
        back: { type: String },
        shiny: { type: String }
    },
    types: [{ type: String }],
    moves: [{ type: String }],
    evolutionChain: [{ type: String }]
});

export default mongoose.model<IPokemon>('Pokemon', PokemonSchema);
