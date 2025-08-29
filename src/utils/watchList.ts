import { getWatchList, saveWatchList} from "./localStorage";

export const addEpisodeToWatchlist = (episode: any, status: "planned" | "watched") => {
    const watchlist = getWatchList();

    const index = watchlist.findIndex((ep: any) => ep.id === episode.id);
    if (index > -1) {
        watchlist[index].status = status;
    } else {
        watchlist.push({ ...episode, status });
    }

    saveWatchList(watchlist);
};

export const removeEpisodeFromWatchlist = (episodeId: number) => {
    const watchlist = getWatchList().filter((ep: any) => ep.id !== episodeId);
    saveWatchList(watchlist);
};
