import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { createPost, deletePost, getCrudPost, Post, updatePost } from "../api/api-list";
import Loading from "../layout/loading";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setEditingPost } from "../redux/slices/posts-slice";
import { optimisticUpdates, useOptimisticMutation } from "../api/hooks/useOptimisticMutations";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Define validation schema with Yup
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const Crud = () => {
  const dispatch = useAppDispatch()
  const { editingPost } = useAppSelector((state) => state.posts)

  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({ resolver: yupResolver(schema), mode: "onChange"});

  // Fetch posts data
  const { data:getCrudPosts, isLoading } = useQuery({
    queryKey: ["getCrudPosts"],
    queryFn: () => getCrudPost(null),
  });

  // Get edit post details
  const { data : editPost } = useQuery({
    queryKey: ["editPost", editingPost],
    queryFn: () => getCrudPost(editingPost),
    enabled: !!editingPost,
  });

  // Create mutation for adding new posts
  const { mutate: createNewPost, isPending } = useOptimisticMutation({
    queryKey: ["getCrudPosts"],
    mutationFn: createPost,
    onMutate: (newPost, queryClient) => {
      queryClient.setQueryData(["getCrudPosts"], (old: Post[] | undefined) => 
        optimisticUpdates.create<Post>(old, newPost)
      );
    },
  });

  // Update mutation
  const { mutate: updatePosts } = useOptimisticMutation({
    queryKey: ["getCrudPosts"],
    mutationFn: updatePost,
    onMutate: (updatedPost, queryClient) => {
      queryClient.setQueryData(["getCrudPosts"], (old: Post[] | undefined) => 
        optimisticUpdates.update<Post>(old, updatedPost)
      );
    },
  });

  // Delete mutation for deleting posts
  const { mutate: removePost } = useOptimisticMutation({
    queryKey: ["getCrudPosts"],
    mutationFn: deletePost,
    onMutate: (id, queryClient) => {
      queryClient.setQueryData(["getCrudPosts"], (old: Post[] | undefined) => 
        optimisticUpdates.delete<Post>(old, id)
      );
    },
  });

  const deleteHandler = (id: string | undefined) => {
    if(id){
      removePost(id)
      if(id === editingPost){
        dispatch(setEditingPost(null))
      }
    }
  }

  useEffect(() => {
    if(editPost){
      setValue("firstName", editPost.firstName)
      setValue("lastName", editPost.lastName)
      setValue("email", editPost.email)
      setValue("password", editPost.password)
    }
  }, [editPost, setValue])

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (formData) => {
    if(editingPost){
      const updatedData = { ...formData, id: editingPost }
      updatePosts(updatedData)
      dispatch(setEditingPost(null))
    } else {
      const uniqueId = `${Date.now()}`; // Add a random ID for the new post
      const newPost = { ...formData, id: uniqueId }; 
      createNewPost(newPost);  // Submit the new post to the API
      reset(); // Reset the form
    }
  };

  // Reset form when editingPost changes to null (when canceling edit)
  useEffect(() => {
    if (!editingPost) {
      reset();
    }
  }, [editingPost, reset]);

  if (isLoading) return <Loading />;

  return (
    <Fragment>
       <div style={{ textAlign: "center", fontSize: "41px", fontWeight: "600", fontFamily: "Poppins", color: "green", marginBlock: "30px" }}>Contact us Form</div>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="input-data">
              <input
                type="text"
                {...register("firstName")}
                style={{
                  border: "none",
                  outline: "none",
                  transition: "border 0.3s ease",
                }}
              />
              <div className="underline" />
              <label htmlFor="firstName">First Name</label>
              {errors.firstName && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.firstName.message}</p>}
            </div>
            <div className="input-data">
              <input
                type="text"
                {...register("lastName")}
                style={{
                  border: "none",
                  outline: "none",
                  transition: "border 0.3s ease",
                }}
              />
              <div className="underline" />
              <label htmlFor="lastName">Last Name</label>
              {errors.lastName && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <input
                type="email"
                {...register("email")}
                style={{
                  border: "none",
                  outline: "none",
                  transition: "border 0.3s ease",
                }}
              />
              <div className="underline" />
              <label htmlFor="email">Email Address</label>
              {errors.email && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.email.message}</p>}
            </div>
            <div className="input-data">
              <input
                type="password"
                {...register("password")}
                style={{
                  border: "none",
                  outline: "none",
                  transition: "border 0.3s ease",
                }}
              />
              <div className="underline" />
              <label htmlFor="password">Password</label>
              {errors.password && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.password.message}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
            <button
              type="submit"
              style={{
                cursor: "pointer",
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                opacity: isPending ? 0.7 : 1,
              }}
              disabled={isPending}
            >
              {editingPost ? "Update" : "Submit"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => dispatch(setEditingPost(null))}
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* post lists */}
        <ul style={{ marginTop: "30px" }}>
          {getCrudPosts?.length === 0 ? (
            <li style={{ textAlign: "center", padding: "20px" }}>No posts found</li>
          ) : (
            getCrudPosts?.map((post: Post) => (
              <li key={post.id} style={{ padding: "10px", border: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}>
                  <p style={{ textTransform: "capitalize", padding: "0px", margin: "0px" }}>FirstName - {post.firstName}</p>
                  <p style={{ textTransform: "capitalize", padding: "0px", margin: "0px" }}>LastName - {post.lastName}</p>
                  <p style={{ textTransform: "capitalize", padding: "0px", margin: "0px" }}>Email - {post.email}</p>
                  <p style={{ textTransform: "capitalize", padding: "0px", margin: "0px" }}>Password - {post.password}</p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <button onClick={() => dispatch(setEditingPost(post.id))} style={{ background: "rgba(0, 128, 0, 0.5)", color: "white" }}>Edit</button>
                  <button onClick={() => deleteHandler(post.id)} style={{ background: "#e74d3c38", color: "white" }}>Delete</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Fragment>
  );
};