import { useState, useEffect } from "react";

const SESSION_KEY = "lastSearch";

export function useSearchCache() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [fromCache, setFromCache] = useState(false);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.query && Array.isArray(parsed.results)) {
                    setQuery(parsed.query);
                    setResults(parsed.results);
                    setFromCache(true);
                }
            }
        } catch {}
    }, []);

    const save = (q: string, r: string[]) => {
        setQuery(q);
        setResults(r);
        setFromCache(false);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ query: q, results: r }));
    };

    const clear = () => {
        setQuery("");
        setResults([]);
        setFromCache(false);
        sessionStorage.removeItem(SESSION_KEY);
    };

    return { query, results, fromCache, save, clear };
}
