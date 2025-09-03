export function addEpisodeToWatchlist(
    username: string,
    show: { id: number; name: string; image?: { medium?: string } },
    episode: { id: string; season?: number; number?: number; name?: string | null; airdate?: string | null },
    status: "watched" | "planned"
) {
    const storageKey = `watchlist_${username}`;
    const watchlist = JSON.parse(localStorage.getItem(storageKey) || "[]");

    let showEntry = watchlist.find((s: any) => s.showId === show.id);

    if (!showEntry) {
        showEntry = {
            showId: show.id,
            name: show.name,
            image: show.image?.medium,
            episodes: [],
        };
        watchlist.push(showEntry);
    }

    const existingEpisode = showEntry.episodes.find((e: any) => e.id === episode.id);
    if (existingEpisode) {
        existingEpisode.status = status;
    } else {
        showEntry.episodes.push({ ...episode, status });
    }

    showEntry.episodes = showEntry.episodes.filter((e: any) => e.status === "watched");

    if (showEntry.episodes.length === 0) {
        const idx = watchlist.findIndex((s: any) => s.showId === show.id);
        if (idx > -1) watchlist.splice(idx, 1);
    }

    localStorage.setItem(storageKey, JSON.stringify(watchlist));
}

export function getWatchList(username: string) {
    const storageKey = `watchlist_${username}`;
    const watchlist = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return watchlist.filter(
        (s: any) => s.episodes && s.episodes.some((e: any) => e.status === "watched")
    );
}
