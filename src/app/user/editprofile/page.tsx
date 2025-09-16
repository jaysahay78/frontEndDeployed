"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { getCurrentUserDetail } from "@/app/(auth)"
import { fetchUserById, updateUserPassword, updateUserProfile } from "@/utils/user-service"
import { Footer } from "@/sections/Footer"
import { get } from "http"
const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });

interface ProfileFormValues {
  name: string
  email: string
  about: string
}

interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      about: "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    fetchUserById(getCurrentUserDetail().id).then((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        profileForm.reset({
          name: currentUser.name || "",
          email: currentUser.email || "",
          about: currentUser.about || "",
        })
      }
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "error",
      })
    })
  }, [profileForm])

  function onProfileSubmit(data: ProfileFormValues) {
    if (!user) return
    setIsSubmitting(true)
    updateUserProfile({
      id: user.id,
      name: data.name,
      email: data.email,
      about: data.about,
    })
      .then(async () => {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        // ✅ Re-fetch the updated user details
        const updatedUser = await getCurrentUserDetail()
        setUser(updatedUser)
        profileForm.reset({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          about: updatedUser.about || "",
        })
      })
      .catch(() => {
        toast({
          title: "Update failed",
          description: "Something went wrong while updating your profile.",
          variant: "error",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }
  

  function onPasswordSubmit(data: PasswordFormValues) {
    if (!user) return

    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)
    updateUserPassword(user.id, {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
      .then(() => {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })
        passwordForm.reset()
      })
      .catch(() => {
        toast({
          title: "Password update failed",
          description: "Check your current password and try again.",
          variant: "error",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (!user) {
    return <div className="p-6 text-center text-muted-foreground">Loading user data...</div>
  }

  return (
    <div>
        <NavbarAuth />
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and bio.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormDescription>This is the email address you use to sign in.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself" className="min-h-32 resize-none" {...field} />
                        </FormControl>
                        <FormDescription>
                          <span className={`${field.value.length > 450 ? "text-amber-500" : ""}`}>
                            {field.value.length}/500 characters
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password. You'll need to enter your current password for security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="my-4" />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 8 characters long.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    <Footer />
    </div>
  )
}
