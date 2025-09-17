import { privateAxios } from "./axiosInstance";
import { myAxios } from "./axiosInstance";
import { User } from "./user-service";

export interface Post {
  postId: string;   // Changed from number → string
  title: string;
  content: string;
  imageName: string;
  addedDate: string;  // Mongo usually stores ISO string dates
  user: User;
  category: {
    categoryId: string;   // Changed from number → string
    categoryTitle: string;
    categoryDescription: string;
  };
  comments: any[]; // You can define proper Comment type later
}

// ✅ Create Post
export const createPost = (postData: any) => {
  const { userId, categoryId, title, content } = postData;
  return privateAxios
    .post(`/user/${userId}/category/${categoryId}/posts`, { title, content })
    .then((response) => response.data);
};

// ✅ Upload Post Image
export const uploadPostImage = (image: File, postId: string) => {
  let formData = new FormData();
  if (image) formData.append("image", image);

  return privateAxios
    .post(`/posts/image/upload/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

// ✅ Load All Posts (added pageSize, sortBy, sortDir)
export const loadAllPosts = (
  pageNumber: number,
  pageSize: number = 10,
  sortBy: string = "addedDate",
  sortDir: string = "desc"
) => {
  return myAxios
    .get(
      `/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((response) => response.data);
};

// ✅ Load Single Post
export const loadPost = (postId: string) => {
  return privateAxios.get(`/posts/${postId}`).then((response) => response.data);
};

// ✅ Create Comment
export const createComment = (content: string, postId: string, userId: string) => {
  return privateAxios
    .post(`/posts/${postId}/user/${userId}/comments`, { content })
    .then((response) => response.data);
};

// ✅ Search Posts by Title
export const loadPostByTitle = (keyword: string) => {
  return myAxios.get(`/posts/search/${keyword}`).then((response) => response.data);
};

// ✅ Delete Post
export const deletePostService = (postId: string) => {
  return privateAxios.delete(`/posts/${postId}`).then((response) => response.data);
};

// ✅ Update Post
export const updatePost = (postId: string, postData: any) => {
  return privateAxios.put(`/posts/${postId}`, postData).then((response) => response.data);
};

// ✅ Load Posts by User
export const loadPostByUser = (userId: string) => {
  return privateAxios.get(`/user/${userId}/posts`).then((response) => response.data);
};
