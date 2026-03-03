'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import { searchQueryAtom } from '@/store';
import { PokemonListItem } from '@/types';
import { apiService } from '@/services/api';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import dynamic from 'next/dynamic';

const PokemonCard = dynamic(() => import('@/components/PokemonCard').then(mod => mod.PokemonCard), {
  loading: () => <SkeletonCard />
});
const SkeletonCard = dynamic(() => import('@/components/SkeletonCard').then(mod => mod.SkeletonCard), {
  ssr: false
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 8;
  const loaderRef = useRef<HTMLDivElement>(null);

  // Custom hook usage
  const entry = useIntersectionObserver(loaderRef, { threshold: 0.1 });
  const isIntersecting = !!entry?.isIntersecting;

  // Fetch logic wrapped in useCallback
  const fetchPokemons = useCallback(async (currentSkip: number, isReset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiService.getPokemons(limit, currentSkip, searchQuery);

      if (isReset) {
        setPokemons(res.data);
      } else {
        setPokemons((prev) => [...prev, ...res.data]);
      }

      setHasMore(currentSkip + limit < res.total);
    } catch (err) {
      setError('Failed to load pokemons. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Handle Search Debounce manually (no lodash)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, setSearchQuery]);

  // Initial fetch and Search change
  useEffect(() => {
    setSkip(0);
    setPokemons([]);
    fetchPokemons(0, true);
  }, [searchQuery, fetchPokemons]);

  // Handle intersection for infinite scroll
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      const nextSkip = skip + limit;
      setSkip(nextSkip);
      fetchPokemons(nextSkip, false);
    }
  }, [isIntersecting, hasMore, loading, skip, limit, fetchPokemons]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30">
      <main className="max-w-3xl mx-auto px-4 py-12 flex flex-col min-h-screen">

        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            Pokédex
          </h1>
          <p className="text-zinc-400">Search and explore your favorite Pokémon</p>

          <div className="max-w-md mx-auto relative mt-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 md:py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-500 shadow-xl"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-center">
            {error}
          </div>
        )}

        {/* List Section: 2 Columns per row */}
        <div className="flex-1">
          {pokemons.length === 0 && !loading && !error ? (
            <div className="text-center text-zinc-500 mt-20">No Pokémon found matching "{searchQuery}"</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {pokemons.map((pokemon) => (
                <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
              ))}

              {/* Skeleton loading placeholders when fetching */}
              {loading && (
                <>
                  {Array.from({ length: pokemons.length === 0 ? 8 : 2 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Intersection Observer Target (Invisible bottom layer) */}
        {!loading && hasMore && !error && (
          <div ref={loaderRef} className="h-20 w-full mt-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!hasMore && pokemons.length > 0 && (
          <div className="text-center text-zinc-600 mt-12 mb-8 text-sm">
            You have reached the end of the list.
          </div>
        )}

      </main>
    </div>
  );
}
