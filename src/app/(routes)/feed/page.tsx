'use client';

import { Footer } from "@/sections/Footer";
import { loadAllPosts } from "@/utils/post-service";
import { useEffect, useState } from "react";
import FeedPostItem from "@/components/feedpostitem";
import { Post } from "@/utils/post-service";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  import { useToast } from "@/hooks/use-toast";
  import dynamic from "next/dynamic";
  import { isLoggedIn } from "@/app/(auth)";
import { loadAllCategories } from "@/utils/category-service";
import { loadPostByTitle } from "@/utils/post-service";
import { useRouter } from "next/navigation";


  const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });
  const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });


export default function NewFeed() {

  const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
          if (searchQuery.trim()) {
            loadPostByTitle(searchQuery).then((data) => {
              setPostContent({
                content: data,
                pageNumber: 0,
                pageSize: data.length,
                totalElements: data.length,
                totalPages: 1,
                lastPage: true,
              });
            }).catch(() => {
              toast({
                variant: "error",
                title: "Error searching posts",
              });
            });
          } else {
            changePage(0); // reset to all posts
          }
        }, 400); // debounce time
      
        return () => clearTimeout(delayDebounce);
      }, [searchQuery]);
      

    const loggedIn = isLoggedIn(); // true or false based on token
    

    const { toast } = useToast();

    const loadCategoryPosts = (categoryId: number) => {
        setActiveCategoryId(categoryId); // highlight selected category

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${categoryId}/posts`)
          .then(res => res.json())
          .then(data => {
            // Assuming data is an array of posts, not paginated
            setPostContent(prev => ({
              ...prev,
              content: data,
              totalPages: 1,
              pageNumber: 0,
              lastPage: true
            }));
            window.scroll(0, 0);
          })
          .catch(error => {
            toast({
              variant: "error",
              title: "Error loading category posts",
            });
          });
      };
      
      const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);


    const [categories, setCategories] = useState<any[]>([]);
    useEffect(() => {
      loadAllCategories().then((data) => {
        setCategories([...data]);
      }).catch((error) => {
        toast({
          variant: "error",
          title: "Error loading categories",
        })
      })
    },[])

    const [postContent, setPostContent] = useState({
        content:[],
        "pageNumber": 0,
        "pageSize":0,
        "totalElements":0,
        "totalPages":0,
        "lastPage": false,
    });

    useEffect(() => {
        changePage(0);
    },[])

    const changePage = (pageNumber=0) => {
        loadAllPosts(pageNumber).then(data => {
            setPostContent(data)
            console.log(data)
            window.scroll(0,0)
        }).catch(error => {
            toast({
                variant:"error",
                title: "Error loading posts",
            })
        })
    }

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

const toggleCategorySelection = (categoryId: number) => {
  setSelectedCategories((prev) =>
    prev.includes(categoryId)
      ? prev.filter((id) => id !== categoryId)
      : [...prev, categoryId]
  );
};


    return (
        <div className="">
          {loggedIn ? <NavbarAuth /> : <Navbar />}
          <div>
          <h1 className="md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text  pl-40">Home</h1>
          
          <div className="flex flex-row px-10 py-5 gap-8">
            {/* Main content/posts */}
            <div className="flex flex-col gap-12 w-full md:w-3/4 pl-16">
              {postContent.content.map((post: Post) => (
                <FeedPostItem post={post} key={post.postId} highlight={searchQuery} />
              ))}
      
              <div className="mt-3">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => changePage(--postContent.pageNumber)}
                        href="#"
                        className={`${
                          postContent?.pageNumber === 0
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
      
                    {[...Array(postContent.totalPages)].map((item, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => changePage(index)}
                          href="#"
                          isActive={index == postContent.pageNumber}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
      
                    <PaginationItem>
                      {!postContent.lastPage ? <PaginationEllipsis /> : ""}
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => changePage(++postContent.pageNumber)}
                        href="#"
                        className={`${
                          postContent?.lastPage
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
          </div>
          
          
            {/* Sidebar menu */}
            <div className="hidden md:block w-1/4 items-end sticky top-0 justify-items-center pr-20">
            <div className="absolute top-[-100px] right-20 p-6">
            <button className="btn btn-primary w-30 items-center" onClick={()=> router.push("/user/post")}>+ New Post</button>
            </div>
                {/*Search bar*/}
                <div className="mt-4 py-1 relative font-sans justify-start pb-6">
                    <div className='bg-gray-100 p-2 rounded-full flex items-center gap-2 scale-75 absolute left-[-40px]'> 
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        width="20" 
                        height="20" 
                        fill="none" 
                        stroke="gray"
                        >
                        <circle cx="10.5" cy="10.5" r="7.5" /> 
                        <line x1="16.5" y1="16.5" x2="22" y2="22" /> 
                        </svg> 
                        <input type="text" value={searchQuery} onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setActiveCategoryId(null);
                        }}
                        placeholder="search a post..." className="bg-transparent" /> 
                    </div>
                </div>
                <div className="text-sm pt-2 gap-3 pl-24 mt-5 mb-5 space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.categoryId}
                      className={`flex items-center ml-3 space-x-2 rounded-sm cursor-pointer ${
                        activeCategoryId === cat.categoryId ? "bg-slate-400" : "hover:bg-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={activeCategoryId === cat.categoryId}
                        onChange={() => {
                          if (activeCategoryId === cat.categoryId) {
                            setActiveCategoryId(null);
                            changePage(0);
                            setSelectedCategories([]);
                          } else {
                            setActiveCategoryId(cat.categoryId);
                            loadCategoryPosts(cat.categoryId);
                          }
                        }}
                        className="accent-slate-600"
                      />
                      <span className="w-full py-1">
                        {cat.categoryTitle}
                      </span>
                    </label>
                  ))}
                </div>
            </div>
            </div>
          </div>
          <Footer />
        </div>
      );      
}