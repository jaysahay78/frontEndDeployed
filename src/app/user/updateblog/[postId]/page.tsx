'use client';

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Footer } from "@/sections/Footer";
import ArrowRight from "@/assets/arrow-right.svg";
import { Input } from "@/components/ui/input";
import { useEffect ,FormEvent, useState } from "react";
import RichTextEditor from "@/components/rich-text-editor";
import { updatePost as doUpdatePost, loadPost, uploadPostImage } from "@/utils/post-service";
import { toast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Image } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });

export default function NewPost() {
  const router = useRouter();
  const { postId } = useParams();
  const [editorKey, setEditorKey] = useState(0);
  const [post, setPost] = useState({ title: '', content: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (!postId) return;
  
    const id = Array.isArray(postId) ? postId[0] : postId;
    const numericId = String(id);
  
    if (numericId.length === 0) return;
  
    loadPost(numericId)
      .then((data) => {
        setPost({
          title: data.title || '',
          content: data.content || '',
        });
        setEditorKey((prev) => prev + 1); // Force re-render of editor with new content
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "error",
          description: "Error in loading post",
        });
      });
  }, [postId]);

  const clearPost = () => {
    setPost({ title: '', content: '' });
    setEditorKey(prev => prev + 1); // reset editor
  };

  const contentFieldChanged = (data: string) => {
    setPost(prev => ({ ...prev, content: data }));
  };

  const fieldChanged = (
    eventOrName: React.ChangeEvent<HTMLInputElement> | string,
    value?: string
  ) => {
    if (typeof eventOrName === "string" && value !== undefined) {
      setPost(prev => ({ ...prev, [eventOrName]: value }));
    } else {
      const event = eventOrName as React.ChangeEvent<HTMLInputElement>;
      setPost(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const updatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = Array.isArray(postId) ? String(postId[0]) : String(postId);
    if (id.length === 0) {
      toast({ variant: "error", description: "Invalid Post ID" });
      return;
    }

    if (post.content.trim() === '') {
      alert("Content is required!");
      return;
    }

    doUpdatePost(id, post)
      .then(data => {
        if (selectedImage) {
          uploadPostImage(selectedImage, id)
            .then(() => {
              toast({
                variant: "success",
                description: "Image uploaded",
              });
              router.push(`/feed`);
            })
            .catch(error => {
              console.error(error);
              toast({
                variant: "error",
                description: "Image upload failed",
              });
            });
        }

        toast({
          variant: "success",
          description: "Post updated successfully!",
        });

        clearPost();
      })
      .catch(error => {
        console.error(error);
        toast({
          variant: "error",
          description: "Post update failed",
        });
      });
  };

  return (
    <div>
    <NavbarAuth />
    <div className="container mx-auto py-0 px-4 md:px-6 flex flex-col min-h-screen">
        <div className="mb-3"> 
          <a href={`/user/dashboard`}> 
          <button className="btn btn-primary"> 
          <ArrowRight className="h-4 w-4 top-0 inline-flex rotate-180" /> 
          Back 
          </button> 
          </a> 
          </div>
        <h1 className="text-3xl font-bold mb-8 mt-2 flex">Update Post</h1>
        <form className="max-w-3xl space-y-6" onSubmit={updatePost}>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={post.title} onChange={fieldChanged}
            name="title"
            placeholder="Enter Post Title"
            className="bg-slate-50"
            required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
          <Label htmlFor="content" className="flex items-center">Content
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 hover:scale-125 transition-all ease-in-out" width="20" height="20" fill="none" viewBox="0 0 24 24" id="magic-stick">
              <path fill="#111" fillRule="evenodd" d="M7.39193 4.37486C6.55879 3.54171 5.208 3.54171 4.37486 4.37486C3.54171 5.208 3.54171 6.55879 4.37486 7.39193L16.6081 19.6251C17.4412 20.4583 18.792 20.4583 19.6251 19.6251C20.4583 18.792 20.4583 17.4412 19.6251 16.6081L7.39193 4.37486ZM3.3142 3.3142C4.73313 1.89527 7.03366 1.89527 8.45259 3.3142L20.6858 15.5474C22.1047 16.9663 22.1047 19.2669 20.6858 20.6858C19.2669 22.1047 16.9663 22.1047 15.5474 20.6858L3.3142 8.45259C1.89527 7.03366 1.89527 4.73313 3.3142 3.3142Z" clipRule="evenodd"></path>
              <path fill="#111" fillRule="evenodd" d="M5.46966 10.5303C5.17677 10.2374 5.17677 9.76256 5.46966 9.46967L9.46966 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967 10.8232 5.76256 10.8232 6.23744 10.5303 6.53033L6.53032 10.5303C6.23743 10.8232 5.76255 10.8232 5.46966 10.5303zM15.6347 2.12433C15.9618 1.29189 17.1377 1.29189 17.4648 2.12433L17.8928 3.21354 18.9775 3.6429C19.8068 3.97121 19.8068 5.14713 18.9775 5.47544L17.8928 5.90481 17.4648 6.99401C17.1377 7.82645 15.9618 7.82646 15.6347 6.99402L15.2067 5.90481 14.122 5.47544C13.2927 5.14714 13.2927 3.97121 14.122 3.6429L15.2067 3.21354 15.6347 2.12433zM15.2133 5.90742C15.2133
              5.90741 15.2132 5.9074 15.2132 5.90739L15.2133 5.90742zM17.8862 5.90742L17.8863 5.90738 17.8862 5.90742zM17.8952 3.21961L17.8952 3.21955 17.8952 3.21961zM16.9645 3.58533L16.5497 2.52989 16.135 3.58533C16.0354 3.83891 15.8351 4.04027 15.5813 4.14073L14.5243 4.55917 15.5813 4.97762 15.3973 5.44252M15.5813 4.97762C15.8351 5.07808 16.0354 5.27943 16.135 5.53301L16.5497 6.58845 16.9645 5.53301C17.0641 5.27943 17.2644 5.07808 17.5181 4.97762L18.5752 4.55917 17.5181 4.14073C17.2644 4.04027 17.0641 3.83891 16.9645 3.58533M21.332 8.94659C21.0049 8.11416 19.8289 8.11416 19.5018 8.94659H21.332zM20.4169 9.35216L20.2756 9.71166C20.176 9.96524 19.9757 10.1666 
              19.7219 10.2671L19.3583 10.411 19.7219 10.555 19.5379 11.0199 19.7219 10.555C19.9757 10.6555 20.176 10.8568 20.2756 11.1104L20.4169 11.4699 20.5582 11.1104C20.6578 10.8568 20.858 10.6555 21.1118 10.555L21.4755 10.411 21.1118 10.2671C20.858 10.1666 20.6578 9.96524 20.5582 9.71166L20.4169 9.35216zM19.5018 8.94659L19.3473 9.33987 19.5018 8.94659zM19.3473 9.33987L18.956 9.49475C18.1266 9.82306 18.1266 10.999 18.956 11.3273L19.3473 11.4822 19.5018 11.8755C19.8289 12.7079 21.0049 12.7079 21.332 11.8755L21.4865 11.4822 21.8778 11.3273C22.7071 10.999 22.7071 9.82306 21.8778 9.49475L21.4865 9.33987 21.332 8.94659M6.49797 15.1243C6.17088 14.2919 4.99493 14.2919 4.66784 15.1243H6.49797zM5.5829 
              15.5299L5.44164 15.8894C5.342 16.143 5.14174 16.3443 4.88796 16.4448L4.52427 16.5888 4.88796 16.7327 4.70393 17.1976 4.88796 16.7327C5.14174 16.8332 5.342 17.0345 5.44164 17.2881L5.5829 17.6476 5.72417 17.2881C5.82381 17.0345 6.02407 16.8332 6.27785 16.7327L6.64154 16.5888 6.27785 16.4448C6.02407 16.3443 5.82381 16.143 5.72417 15.8894L5.5829 15.5299zM4.66784 15.1243L4.5133 15.5176 4.66784 15.1243zM4.5133 15.5176L4.12202 15.6725C3.29266 16.0008 3.29266 17.1767 4.12203 17.505L4.5133 17.6599 4.66784 18.0532C4.99493 18.8856 6.17088 18.8856 6.49797 18.0532L6.65251 17.6599 7.04378 17.505C7.87315 17.1767 7.87315 16.0008 7.04378 15.6725L6.65251 15.5176 6.49797 15.1243" clipRule="evenodd"></path>
            </svg>
            </HoverCardTrigger>
            <HoverCardContent side="left">
              Try typing with "/write" to get AI suggestions
            </HoverCardContent>
          </HoverCard>
            </Label>
            <div className="gap-2 mt-2">
              <button
                type="button"
                onClick={() => document.getElementById('imageUpload')?.click()}
                className=""
              >
                <Image className="size-5 text-gray-700 ml-80" />
              </button>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => handleImageSelect(e)}
                className="hidden"
              />
            </div>
            </div>

            <RichTextEditor key={editorKey} content={post.content} 
            onChange={contentFieldChanged}
            />
          </div>

          <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="btn btn-primary bg-black hover:bg-slate-400 text-white font-medium py-2 px-4 rounded-xl shadow"
          >
            Submit Post
          </button>

          <button
             type="button"
             onClick={clearPost}
             className="btn border border-slate-300 bg-white hover:bg-slate-100 text-black font-medium py-2 px-4 rounded-xl shadow"
           >
             Reset
           </button>
        </div>

        </form>
    </div>
    <Footer />
    </div>
  )
}