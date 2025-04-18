import axios from "axios";
import { axiosInstance } from "./middleware";
import toast from "react-hot-toast";

// user api start(https://jsonplaceholder.typicode.com) ================================

const userApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// infintie scrolling - Button click fetch users

export const fetchUsers = async ({ pageParam, perPage = 10 }: { pageParam: number; perPage?: number }) => {
  try {
    const res = await userApi.get(`/posts?_page=${pageParam}&_limit=${perPage}`);
    return res.data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to fetch users");
  }
};

// user api end ================================

// crud api start (https://mockapi.io) ================================

const crudApi = axios.create({
  baseURL: "https://6801f11a81c7e9fbcc43cc80.mockapi.io/api/v1",
});

// get all posts
export const getCrudPost = async (id: string | null) => {
  try {
    if(id){
      const res = await crudApi.get(`/posts/${id}`);
      return res.data;
    }
    const res = await crudApi.get("/posts");
    return res.data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : id ? "Failed to get edit post" : "Failed to fetch posts");
  }
};

// create a new post
export interface Post {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// create a new post
export const createPost = async (post: Post) => {
  try {
    const res = await crudApi.post("/posts", post);
    if(res){
      toast.success("Post created successfully");
    }
    return res.data;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : "Failed to create post");
  }
};

// delete post
export const deletePost = async (id: string) => {
  try {
    const res = await crudApi.delete(`/posts/${id}`);
    if(res){
      toast.success("Post deleted successfully");
    }
    return res.data;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : "Failed to delete post");
  }
};

// update post
export const updatePost = async (post: Post) => {
  try {
    const res = await crudApi.put(`/posts/${post.id}`, post);
    if(res){
      toast.success("Post updated successfully");
    }
    return res.data;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : "Failed to update post");
  }
};

// crud api end ================================

// auth api start (https://fakeapi.platzi.com) ================================

// login
export const login = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/login", { email, password });
    if(res){
      toast.success("Login successfully");
    }
    return res.data;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : "Failed to login");
  }
};

// get profile

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get("/profile");
    return res.data;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : "Failed to get profile");
  }
};

// auth api end ================================
