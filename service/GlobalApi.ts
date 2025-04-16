/// <reference types="vite/client" />
// import axios from "axios";

// const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// const axiosClient = axios.create({
//   baseURL: "http://localhost:1337/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + API_KEY,
//   },
// });

// export const CreateNewNews = (data: any) =>
//   axiosClient.post("/user-news", data);
// export const GetAuthorNews = (author_email: string | undefined) =>
//   axiosClient.get(
//     "/user-news?filters[author_email][$eq]=" + author_email,
//   );
// export const UpdateNewsDetail = (id: string | undefined, data: any) =>
//   axiosClient.put(`/user-news/${id}`, data);



// export const UploadImageStrapi = (data: any) => axiosClient.post("/upload", data);

