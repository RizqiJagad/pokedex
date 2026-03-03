import { memo } from 'react';
import Link from 'next/link';
import { PokemonListItem } from '../types';
import Image from 'next/image';

interface Props {
    pokemon: PokemonListItem;
}

const PokemonCardComponent = ({ pokemon }: Props) => {
    // Using a robust fallback image logic, PokeAPI sprite format:
    // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    return (
        <Link href={`/pokemon/${pokemon.name}`}>
            <div className="group bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-xl rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10 shadow-lg hover:shadow-cyan-500/20 cursor-pointer h-full relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all"></div>

                <span className="absolute top-3 left-3 text-xs font-bold text-zinc-500">#{pokemon.id.toString().padStart(3, '0')}</span>

                <div className="relative w-24 h-24 z-10 transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src={imageUrl}
                        alt={pokemon.name}
                        fill
                        sizes="96px"
                        className="object-contain drop-shadow-md"
                        unoptimized // Since we load external raw URL we skip NextJS optimization for simplicity or configure domains in next.config
                    />
                </div>

                <h3 className="capitalize font-semibold text-lg text-white z-10 tracking-wide">
                    {pokemon.name}
                </h3>
            </div>
        </Link>
    );
};

export const PokemonCard = memo(PokemonCardComponent);
