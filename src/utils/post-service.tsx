import { privateAxios } from "./axiosInstance";
import { myAxios } from "./axiosInstance";
import { User } from "./user-service";

export interface Post {
  postId: number;
  title: string;
  content: string;
  imageName: string;
  addeddate: number;
  user: User;
  category: {
    categoryId: number;
    categoryTitle: string;
    categoryDescription: string;
  };
  comment: any[]; // You can replace `any` with a proper Comment interface if you have one
}


export const createPost = (postData: any) => {
    const { userId, categoryId, title, content } = postData;
  
    return privateAxios.post(
      `/user/${userId}/category/${categoryId}/posts`,
      { title, content }
    ).then(response => response.data);
  };

export const uploadPostImage = (image: any, postId: number) => {
    let formData = new FormData()
    if (image) formData.append("image", image);
    return privateAxios.post(`/posts/image/upload/${postId}`, formData, {
      headers:{
        'Content-Type':'multipart/form-data'
      }
    }).then((response)=>response.data)
}


export const loadAllposts=(pageNumber: number)=>{
  return myAxios.get(`/posts?pageNumber=${pageNumber}`).then((response)=>response.data)
}

export const loadPost=(postId: number)=>{
  return privateAxios.get("/posts/" + postId).then((response)=>response.data)
}

export const createComment=(content: string, postId: number,  userId: number)=>{
  return privateAxios.post(`/posts/${postId}/user/${userId}/comments`, { content }).then((response)=>response.data)
}

export const loadPostByTitle = (keyword: string) => {
  return myAxios.get(`/posts/search/${keyword}`).then((response) => response.data);
};

export const deletePostService = (postId: number) => {
  return privateAxios.delete(`/posts/${postId}`).then((response) => response.data);
}

export const updatePost = (postId: number, postData: any) => {
  return privateAxios.put(`/posts/${postId}`, postData).then((response) => response.data);
}

export const loadPostByUser = (userId: number) => {
  return privateAxios.get(`/user/${userId}/posts`).then((response) => response.data);
}
