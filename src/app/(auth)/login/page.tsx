'use client';

import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/sections/Footer";
import { login } from "@/utils/user-service";
import Spline from "@splinetool/react-spline";
import { useContext, useState } from "react";
import { doLogin } from "..";
import { useRouter } from "next/navigation"
import UserContext from "@/context/UserContext";
const Navbarsignup= dynamic(() => import("@/components/Navbarsignup"), { ssr: false });

export default function LoginPage() {

    const { toast } = useToast();

    const userContextData = useContext(UserContext)

    const router = useRouter()

    const [loginDetail, setLoginDetail]=useState({
        email:'',
        password:''
    })

    const [error, setError] = useState<{ email?: string; password?: string }>({});

    const handleChange=(event:React.ChangeEvent<HTMLInputElement>,field:string)=>{
        let actualValue=event.target.value
        setLoginDetail({
            ...loginDetail,[field]:actualValue
        })
    }

    const handleFormSubmit=(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        const newErrors: { email?: string; password?: string } = {};

        if (!loginDetail.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (loginDetail.password.trim().length < 6) {
            newErrors.password = "Password must be of at least 6 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        login(loginDetail).then((data) => {
            console.log("User login:", data);
            doLogin(data, () => {
                console.log("Login details saved in local storage");
                if (data && data.user) {
                    userContextData?.setUser({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        about: data.user.about,
                        roles: data.user.roles,
                    });
                }
                setLoginDetail({ email: '', password: '' });
                router.push("/feed");
                toast({
                    variant: "success",
                    description: "User Logged in",
                });
            });
        }).catch((error)=> {
            if (error.response) {
                const { status, data } = error.response;
          
                if (status === 401 || status === 400) {
                    toast({
                      variant: "error",
                      title: "Invalid email or password",
                      description: "Kindly enter the correct credentials",
                    });
                    return;
                   }

            }
            else{
            toast({
                variant:"error",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
              })
            }
        })
        
    }

    const resetData=()=>{
        setLoginDetail({
            email:'',
            password:'',
        })
        setError({});
    }

    


    return (
        <div className="bg-[linear-gradient(to_bottom,#00021a,#000000)] min-h-screen flex flex-col overflow-x-clip">
            <Navbarsignup />
            <div className="relative flex items-center justify-center min-h-screen">
                
                {/* Gradient Sign Up Heading */}
                <h1 className="w-full text-center 
                    sm:absolute sm:top-5 sm:left-1/2 sm:-translate-x-1/2
                    text-5xl sm:text-6xl md:text-7xl lg:text-9xl lg:left-[750px]
                    font-extrabold bg-gradient-to-b from-[#0a0f2c] via-gray-200 to-white 
                    bg-clip-text text-transparent leading-none transition-all 
                    mb-6 sm:mb-0 lg:top-[5px] pb-6">
                        Login
                    </h1>

                {/* Spline Object Positioned to the Left */}
                <div className="hidden  lg:block robot absolute left-[5px] top-1/2 transform -translate-y-1/2 w-full max-w-[700px]">
                    <Spline scene="https://prod.spline.design/78FaKy3J8YZqb1BW/scene.splinecode" />
                </div>

                {/* Signup Form Positioned to the Right */}
                <div className="card md:w-1/2 md:ml-auto md:mr-20 bg-white rounded-2xl p-8 md:p-10 
                            shadow-[0_0_40px_rgba(255,255,255,0.4)] max-w-md">
                    
                    <h2 className="text-3xl font-bold text-black mb-6">Login to your account</h2>
                    
                    <form className="space-y-6 sm:top-10 sm:mt10" onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="JohnDoe@gmail.com"
                                required
                                value={loginDetail.email}
                                onChange={(e)=>handleChange(e, 'email')}
                            />
                            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="password"
                                required
                                value={loginDetail.password}
                                onChange={(e)=>handleChange(e, 'password')}
                            />
                            <p className="mt-1 text-xs text-gray-600">
                                Must be at least 6 characters with a number
                            </p>
                            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button
                                onClick={resetData}
                                type="reset"
                                className="w-[150px] bg-black text-white py-3 rounded-full font-medium transition-all ease-in-out duration-700 hover:bg-gray-900 hover:scale-105"
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="w-[150px] bg-black text-white py-3 rounded-full font-medium transition-all ease-in-out duration-700 hover:bg-gray-900 hover:scale-105">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
