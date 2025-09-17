'use client';

import { getCurrentUserDetail } from "@/app/(auth)";
import UserProvider from "@/context/UserProvider";
import { Footer } from "@/sections/Footer";
import { useEffect, useState } from "react";
import { fetchUserById, User } from "@/utils/user-service";
import dynamic from "next/dynamic";
import Image from "next/image"
import { Calendar, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePostService, loadPostByUser, Post } from "@/utils/post-service";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); // Specify type for better type safety
// Load user
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userData = await fetchUserById(getCurrentUserDetail()?.id || 0);
      if (userData) setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  fetchUserData();
}, []);

// Fetch user posts
useEffect(() => {
  if (user?.id) {
    loadPostByUser(user.id)
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error loading user posts:", error);
      });
  }
}, [user]);

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


function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

    return (
    <UserProvider> {/* Wrap component with UserProvider if not wrapped globally */}
      <div>
        <NavbarAuth />
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-7">
            {/* User Profile Summary */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-col items-center text-center">
              <CardTitle className="mt-4">{user?.name || "User"}</CardTitle>
                <CardDescription>{user?.email || "user@example.com"}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{user?.about}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => router.push("/user/editprofile")} className="w-full" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            {/* My Posts */}
            <div className="md:col-span-5">
              <Tabs defaultValue="posts" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="posts">My Posts</TabsTrigger>
                  </TabsList>
                  <button className="btn btn-primary w-30 items-center" onClick={()=> router.push("/user/post")}>+ New Post</button>
                </div>
                <TabsContent value="posts" className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.postId}>
                      <div className={`flex ${post.imageName !== "default.png" ? "flex-col md:flex-row" : "flex-col"} w-full`}>
                        {post.imageName !== "default.png" && (
                          <div className="md:w-1/4 p-4">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/image/${post.imageName}`}
                              alt={post.title}
                              width={300}
                              height={200}
                              className="rounded-md object-cover w-full h-40"
                            />
                          </div>
                        )}
                        <CardContent className={`${post.imageName !== "default.png" ? "flex-1 p-6" : "p-6 w-full"}`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {post?.addedDate ? new Date(post.addedDate).toLocaleDateString() : "Unknown date"}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {stripHtmlTags(post.content).substring(0, 60)}...
                          </p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/singlepage/${post.postId}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {router.push(`/user/updateblog/${post.postId}`)}}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Post</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                  <Button variant="destructive" onClick={()=>{deltePost; setDeleteDialogOpen(false)}}>Delete</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">You haven't created any posts yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </UserProvider>
  );
}
