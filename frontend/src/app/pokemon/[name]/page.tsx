'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PokemonDetail } from '@/types';
import { apiService } from '@/services/api';

export default function PokemonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const name = params?.name as string;

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!name) return;

        let isMounted = true;
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiService.getPokemonDetail(name);
                if (isMounted) setPokemon(data);
            } catch (err) {
                if (isMounted) setError('Failed to load Pokémon details.');
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [name]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-400 animate-pulse">Loading Pokédex Data...</p>
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center">
                <div className="text-red-400 text-xl mb-4">{error || 'Pokemon not found'}</div>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    Back to Pokédex
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-12">
                {/* Navigation */}
                <button
                    onClick={() => router.push('/')}
                    className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Pokedex
                </button>

                {/* Header content: Name & Id */}
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold capitalize tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                        {pokemon.name}
                    </h1>
                    <span className="text-2xl font-bold text-zinc-500">
                        #{pokemon.id.toString().padStart(3, '0')}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Sprites & Types */}
                    <div className="space-y-8">
                        {/* Sprites Showcase */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

                            <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6 font-semibold">Appearance</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative w-24 h-24 bg-black/20 rounded-xl">
                                        {pokemon.sprites.front && (
                                            <Image src={pokemon.sprites.front} alt="Front" fill sizes="96px" className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" unoptimized />
                                        )}
                                    </div>
                                    <span className="text-xs text-zinc-400">Front</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative w-24 h-24 bg-black/20 rounded-xl">
                                        {pokemon.sprites.back && (
                                            <Image src={pokemon.sprites.back} alt="Back" fill sizes="96px" className="object-contain" unoptimized />
                                        )}
                                    </div>
                                    <span className="text-xs text-zinc-400">Back</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative w-24 h-24 bg-black/20 rounded-xl">
                                        {pokemon.sprites.shiny && (
                                            <Image src={pokemon.sprites.shiny} alt="Shiny" fill sizes="96px" className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" unoptimized />
                                        )}
                                    </div>
                                    <span className="text-xs text-zinc-400">Shiny</span>
                                </div>
                            </div>
                        </div>

                        {/* Types & Physical Stats */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl grid gap-6">
                            <div>
                                <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-3 font-semibold">Types</h3>
                                <div className="flex flex-wrap gap-2">
                                    {pokemon.types.map(type => (
                                        <span key={type} className="px-4 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-sm font-medium capitalize tracking-wide shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-semibold">Height</h3>
                                    <p className="text-xl font-medium text-white">{(pokemon.height / 10).toFixed(1)} m</p>
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-semibold">Weight</h3>
                                    <p className="text-xl font-medium text-white">{(pokemon.weight / 10).toFixed(1)} kg</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Evolution & Moves */}
                    <div className="space-y-8">

                        {/* Evolution Chain */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6 font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Evolution Chain
                            </h3>

                            {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    {pokemon.evolutionChain.map((evoName, index) => (
                                        <div key={evoName} className="flex items-center gap-3">
                                            <Link href={`/pokemon/${evoName}`}>
                                                <div className={`px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer capitalize font-medium ${evoName === pokemon.name
                                                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                        : 'bg-black/20 border-white/10 text-zinc-300 hover:border-cyan-500/50 hover:text-white'
                                                    }`}>
                                                    {index + 1}. {evoName}
                                                </div>
                                            </Link>
                                            {index < pokemon.evolutionChain.length - 1 && (
                                                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 italic text-sm">No evolution data available.</p>
                            )}
                        </div>

                        {/* Moves List */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4 font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Abilities & Moves <span className="text-xs text-zinc-600 font-normal lowercase">(Max 10)</span>
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {pokemon.moves && pokemon.moves.length > 0 ? (
                                    pokemon.moves.map(move => (
                                        <span key={move} className="px-3 py-1.5 bg-black/40 text-zinc-300 border border-white/5 rounded-lg text-sm capitalize hover:bg-black/60 transition-colors cursor-default">
                                            {move.replace('-', ' ')}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-zinc-500 italic text-sm">No moves available.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
