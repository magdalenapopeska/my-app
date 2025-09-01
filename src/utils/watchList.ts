import { getWatchList as getLocalStorageList, saveWatchList as saveGlobalList} from "./localStorage";
export const getWatchList = (username: string) => {
    const data = localStorage.getItem(`watchList_${username}`);
    return data ? JSON .parse(data) : [];
};

export const saveWatchList = (username: string, watchList: any[]) => {
    localStorage.setItem(`watchList_${username}`, JSON.stringify(watchList));
}

export const addEpisodeToWatchlist = (username: string, episode: any, status: "planned" | "watched") => {
    const watchlist = getWatchList(username);

    const index = watchlist.findIndex((ep: any) => ep.id === episode.id);
    if (index > -1) {
        watchlist[index].status = status;
    } else {
        watchlist.push({ ...episode, status });
    }

    saveWatchList(username, watchlist);
};

export const removeEpisodeFromWatchlist = (username: string, episodeId: number) => {
    const watchlist = getWatchList(username).filter((ep: any) => ep.id !== episodeId);
    saveWatchList(username, watchlist);
};
