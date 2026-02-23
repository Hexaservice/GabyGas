'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type SearchKind = 'service' | 'product' | 'faq';

type SearchResult = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  url: string;
  score: number;
};

const kindLabel: Record<SearchKind, string> = {
  service: 'Servicio',
  product: 'Producto',
  faq: 'FAQ',
};

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const canSearch = query.trim().length >= 2;

  async function search(text: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setSuggestions(data.suggestions ?? []);
      setLastQuery(text);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAutocomplete(text: string) {
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(text)}`);
    const data = await res.json();
    setSuggestions(data.suggestions ?? []);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAutocomplete(query);
    }, 180);

    return () => clearTimeout(timeout);
  }, [query]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSearch) return;
    await search(query.trim());
  }

  const noResults = useMemo(() => !loading && lastQuery && results.length === 0, [lastQuery, loading, results.length]);

  async function onResultClick(item: SearchResult) {
    await fetch('/api/search/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: lastQuery || query, resultId: item.id, kind: item.kind }),
    });
  }

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="h1">Buscar</h1>
      <form className="card space-y-3" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span>Búsqueda unificada (servicios, productos y FAQs)</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="field"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ejemplo: revicion de calentador en medellin"
            />
            <button type="submit" className="btn-primary sm:w-auto" disabled={!canSearch || loading}>
              {loading ? 'Buscando…' : 'Buscar'}
            </button>
          </div>
        </label>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-100"
                  onClick={() => {
                    setQuery(suggestion);
                    search(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {noResults && <p className="card text-sm text-slate-700">No encontramos resultados para “{lastQuery}”.</p>}

      {results.length > 0 && (
        <ul className="space-y-3">
          {results.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="card">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">{kindLabel[item.kind]}</p>
              <Link href={item.url} className="text-lg font-semibold hover:underline" onClick={() => onResultClick(item)}>
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-slate-700">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
