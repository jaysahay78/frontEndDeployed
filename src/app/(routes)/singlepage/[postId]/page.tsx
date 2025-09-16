"use client";

import { toast } from "@/hooks/use-toast";
import { Footer } from "@/sections/Footer"
import { createComment, loadPost, Post } from "@/utils/post-service";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import Image from "next/image";
import PostMenuAction from "@/components/postMenuAction";
import Search from "@/components/search";
import dynamic from "next/dynamic";
import { getCurrentUserDetail, isLoggedIn } from "@/app/(auth)";
import PostContent from "@/lib/PostContent";
import { formatDistanceToNow } from 'date-fns';

const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

function timeAgo(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export default function SinglePostPage() {

    const loggedIn = isLoggedIn(); 
    const userDetail = getCurrentUserDetail();
    const { postId } = useParams();
    const [post, setPost] = useState<Post>();
    const [comment, setComment] = useState<{ content: string }>({ content: "" });

    const submitPost = () => {
      if (!post?.postId || !userDetail?.id || !comment?.content.trim()) {
        toast({
          variant: "error",
          description: "Post or user ID missing, or comment is empty",
        });
        return;
      }
    
      createComment(comment.content, post.postId, userDetail?.id)
        .then((data) => {
          console.log(data);
          setComment({ content: "" }); // Clear the comment input after submission
          toast({
            variant: "success",
            description: "Comment added successfully",
          });
          setPost((prevPost) =>
            prevPost
              ? {
                  ...prevPost,
                  comment: [...(prevPost.comment || []), data],
                }
              : prevPost
          );
        })
        .catch((error) => {
          console.error(error);
          toast({
            variant: "error",
            description: "Error in adding comment",
          });
        });
    };
    
    useEffect(()=>{

        if (!postId) return;

        const id = Array.isArray(postId) ? postId[0] : postId;
        const numericId = Number(id);
      
        if (isNaN(numericId)) return;

        loadPost(numericId).then(data=>{
            console.log(data);
            setPost(data)
        }).catch(error=>{
            console.log(error);
            toast({
                variant:"error",
                description:"error in loading post",
            })
        })
    }, [])

        return (
                <div className="min-h-screen flex flex-col overflow-x-clip">
                    {loggedIn ? <NavbarAuth /> : <Navbar />}
                    <div className="w-full flex-1 px-4 py-8 min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#A8C4FF,#EAEEFE_100%)]">
                    <div className=" w-full flex flex-col lg:flex-row justify-between gap-8 relative">

            {/* Left content area */}
            <div className="lg:w-full flex-1 max-w-5xl pl-32">
            <div className="max-w-4xl">
                <h1 className="text-4xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold">{post?.title}</h1>
                <div className="text-sm mt-3">
                <span>written by </span>
                <span className="font-bold">{post?.user.name} </span>
                <span>on </span>
                <span className="font-semibold"> {post?.addeddate ? new Date(post.addeddate).toLocaleDateString() : "Unknown date"}</span>
                <div className="mt-2">
                    <span> {post?.category.categoryTitle}</span>
                </div>
                </div>
            </div>

            {post?.imageName !== "default.png" && (
              <div className="image-container pt-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/image/${post?.imageName}`}
                  alt="post image"
                  className="rounded-2xl shadow-[1px_4px_27px_-13px_#000000] scale-90"
                  height={506.25}
                  width={900}
                  unoptimized
                />
              </div>
            )}

                <div className="mt-5">
                <PostContent content={post?.content || ""} />
                </div>
                </div>

                {/* Right menu section */}
                <div className="w-full lg:w-[300px] h-max sticky top-20 px-3 pb-5">
                  <div>
                    <h2 className="text-sm font-semibold mb-1"><mark className="bg-purple-400 text-black">Author</mark></h2>
                    <p className="text-xs py-1">{post?.user.name}</p>
                    <p className="text-xs py-2 text-gray-600">{post?.user.about}</p>
                  </div>
                  {post && <PostMenuAction post={post} />}
                 
                  </div>
              </div>
            </div>
            {/*comment section*/}
            <div className="mt-5 px-4 gap-10 lg:w-3/5 ml-24 ">
                        <div className="flex flex-col gap-8 lg:w-3/5"><h1>Comments</h1></div>
                        <div className="flex items-center justify-between gap-8 w-full mt-3">
                            <textarea placeholder="Write a comment..." className="w-full p-4 rounded-xl mt-4 mb-14"
                            value={comment.content}
                            onChange={(event)=> setComment({ content: event.target.value })}
                            ></textarea>
                            <button className="btn btn-primary bg-black px-4 py-3 font-normal rounded-xl"
                            onClick={submitPost}>send</button>
                        </div>
                        {post && post?.comment?.map((c)=>(
                        <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-3 mt-4 mb-8">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                          {c.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">{c.user.name}</span>
                            <span> {timeAgo(c.addeddate)}</span>
                          </div>
                          <p className="mt-1 text-gray-800 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                      ))}
                      </div>
            <Footer />
        </div>
    )
}