'use client';
import { useState, useRef, useEffect } from 'react';
import { getCurrentUserDetail, isLoggedIn } from '@/app/(auth)';
import { deletePostService, Post } from '@/utils/post-service';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';

interface FeedPostItemProps {
    post: Post;
  }

function deltePost(post: Post) {
  // Implement the delete post logic here
  deletePostService(post.postId).then((response) => {
    console.log(response);
    toast({
      variant: "success",
      title: "Post deleted successfully",
    })
  }).catch(error => {
    console.error(error);
    toast({
      variant: "error",
      title: "Error deleting post",
    });
  });
}

export default function PostMenuAction(post: FeedPostItemProps) {

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const userDetail = getCurrentUserDetail();
  const isOwner = isLoggedIn() && userDetail?.id === post.post.user.id;

  useEffect(() => {
    // Get current URL when component mounts
    setShareUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    const text = inputRef.current?.value;
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  

  return (
    <div className="mt-4 py-1 relative font-sans">
      <h2 className="text-sm font-semibold text-gray-800">Actions</h2>

      {isOwner && (
      <div className="flex items-center gap-2 mt-3 text-sm text-red-700 cursor-pointer hover:underline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 15 15"
          width="15"
          height="15"
          className="fill-red-700 left-3 top-[150px]"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
        <div>
          <span onClick={() => setShowModalDelete(true)} className="text-xs mt-2">Delete this post</span>
        </div>
      </div>
      )}


      {/* Edit Button */}
      {isOwner && (
      <div className="flex items-center gap-2 mt-3 text-sm text-blac cursor-pointer hover:underline">
        <Edit className="mr-2 h-4 w-4" />
        <div>
          <span onClick={() => {router.push(`/user/updateblog/${post.post.postId}`)}} className="text-xs mt-2">Edit this post</span>
        </div>
      </div>
      )}


      {/* Share Button */}
      <div className="flex items-center gap-2 mt-1 text-sm text-black cursor-pointer hover:underline" onClick={() => setShowModal(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
        </svg>
        <div>
          <span className="text-xs mt-2">Share this post</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full relative">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-lg font-semibold">Share Modal</span>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-base mb-3">Share this link via</p>
              <div className="flex justify-between gap-2 mb-5">
                <a href={`https://www.facebook.com/`} data-size= "large" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] border border-[#b7d4fb] hover:bg-[#1877F2] hover:text-white transition rounded-full w-12 h-12 flex items-center justify-center">
                  <i className="fab fa-facebook" />
                </a>
                <a href={`https://x.com/intent/tweet?url=${encodedUrl}&text=I really loved this blog post- `}
                  data-size="large"
                  target="_blank"
                  rel="noopener noreferrer" className="text-[#46C1F6] border border-[#b6e7fc] hover:bg-[#46C1F6] hover:text-white transition rounded-full w-12 h-12 flex items-center justify-center">
                  <i className="fab fa-twitter" />
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer" className="text-[#25D366] border border-[#bef4d2] hover:bg-[#25D366] hover:text-white transition rounded-full w-12 h-12 flex items-center justify-center">
                  <i className="fab fa-whatsapp" />
                </a>
                <a
                    href={`https://t.me/share/&text=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0088cc] border border-[#b3e6ff] hover:bg-[#0088cc] hover:text-white transition rounded-full w-12 h-12 flex items-center justify-center"
                    >
                    <i className="fab fa-telegram-plane" />
                    </a>
              </div>

              <p className="text-base">Or copy link</p>
              <div className={`mt-2 flex items-center border rounded px-2 h-11 ${copied ? 'border-purple-600' : 'border-gray-300'}`}>
                <i className={`uil uil-link w-6 text-center text-[18px] ${copied ? 'text-purple-600' : 'text-gray-500'}`} />
                <input
                  ref={inputRef}
                  readOnly
                  value={`${shareUrl}`}
                  className="flex-1 text-sm px-2 outline-none border-none bg-transparent"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium px-4 py-1 rounded"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          {showModalDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full relative">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-lg font-semibold">Are you sure you want to delete this post?</span>
                  <button
                    onClick={() => setShowModalDelete(false)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                {/* Buttons Section */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="bg-red-500 hover:bg-red-900 text-white text-sm font-medium px-4 py-2 mr-14 rounded items-start"
                    onClick={() => {
                      deltePost(post.post);
                      setShowModalDelete(false);
                      router.push("/feed")
                    }}
                  >
                    Delete post
                  </button>

                  <button
                    onClick={() => setShowModalDelete(false)}
                    className="bg-gray-100 hover:bg-gray-300 text-black text-sm font-medium px-4 py-2 ml-14 rounded items-end"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

    </div>
  );
}
