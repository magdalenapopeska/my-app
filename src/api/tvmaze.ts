import axios from "axios";

const API = axios.create({baseURL: "https://api.tvmaze.com",});

export const searchShows = (q: string) =>
    API.get(`/search/shows?q=${encodeURIComponent(q)}`);

export const getShowDetails = (id: number) =>
    API.get(`/shows/${id}?embed=episodes`);

export const getSchedule = (country = "US", date: string) =>
    API.get(`/schedule?country=${country}&date=${date}`);

export const getShowEpisodes = (id: number | undefined) =>
    API.get(`/shows/${id}?embed=episodes`);

export const getPopularShows = (page: number = 0) =>
    API.get(`/shows?page=${page}`);