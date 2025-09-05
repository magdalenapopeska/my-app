import toast from 'react-hot-toast';

export async function addEpisodeToWatchlist(
    username: string,
    show: { id: number; name: string; image?: { medium?: string }; genres?: string[]; },
    episode: { id: string; season?: number; number?: number; name?: string | null; airdate?: string | null },
    status: "watched" | "planned",
) {
    try {
        const storageKey = `watchlist_${username}`;
        const watchlist = JSON.parse(localStorage.getItem(storageKey) || "[]");

        let showEntry = watchlist.find((s: any) => s.showId === show.id);

        if (!showEntry) {
            let genres = show.genres ?? [];
            if (genres.length === 0) {
                try {
                    const res = await fetch(`https://api.tvmaze.com/shows/${show.id}`);
                    const fullShow = await res.json();
                    genres = fullShow.genres ?? [];
                } catch (err) {
                    console.error("Failed to fetch genres:", err);
                }
            }

            showEntry = {
                showId: show.id,
                name: show.name,
                image: show.image?.medium,
                genres,
                episodes: [],
            };
            watchlist.push(showEntry);
        }

        const existingEpisode = showEntry.episodes.find((e: any) => e.id === episode.id);
        if (existingEpisode) {
            existingEpisode.status = status;
            toast.success(`Episode updated to ${status}`);
        } else {
            showEntry.episodes.push({...episode, status});
            toast.success(`Episode added as ${status}`);
        }


        if (showEntry.episodes && showEntry.episodes.length === 0) {
            const idx = watchlist.findIndex((s: any) => s.showId === show.id);
            if (idx > -1) {
                watchlist.splice(idx, 1);
                toast.success(`Removed ${show.name} from Watch List`);
            }
        }

        localStorage.setItem(storageKey, JSON.stringify(watchlist));
    } catch (err) {
        console.error("Error updating watchlist");
        toast.error("Something went wrong while updating watchList");
    }
}

export function getWatchList(username: string) {
    const storageKey = `watchlist_${username}`;
    const watchlist = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return watchlist.filter(
        (s: any) => s.episodes && s.episodes.length > 0
    );
}
