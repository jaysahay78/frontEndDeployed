'use client';

import { myAxios } from "./axiosInstance";

export const loadAllCategories = () => {
    return myAxios.get(`/categories/`).then(response=>{return response.data})
};
