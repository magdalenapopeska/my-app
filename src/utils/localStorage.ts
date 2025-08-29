export const getWatchList = () => {
    const data = localStorage.getItem("watchList");
    return data ? JSON.parse(data) : [];
}

export const saveWatchList = (watchList: any[]) => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
}