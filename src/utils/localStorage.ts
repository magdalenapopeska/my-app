export const getWatchList = () => {
    const data = localStorage.getItem("watchList");
    return data ? JSON.parse(data) : [];
}
export const saveWatchList = (username: string, watchList: any[]) => {
    localStorage.setItem(`watchList_${username}`, JSON.stringify(watchList));
}