import Cookies from "js-cookie";

// ✅ Check if the user is logged in
export const isLoggedIn = () => {
    const token = Cookies.get("token"); // Check token in cookies
    return token !== undefined; // User is logged in if token exists
};

// ✅ Store login data in both localStorage & Cookies
export const doLogin = (data: any, next: any) => {
    localStorage.setItem("data", JSON.stringify(data)); // Store full user data
    Cookies.set("token", data.jwtToken, { expires: 7, secure: true, sameSite: "strict" }); // Store token securely
    next();
};

// ✅ Logout user by clearing both localStorage & Cookies
export const doLogout = (next: any) => {
    localStorage.removeItem("data");
    Cookies.remove("token");
    next();
};

// ✅ Get current user details from localStorage
export const getCurrentUserDetail = () => {
    if (isLoggedIn()) {
        const data = localStorage.getItem("data");
        return data ? JSON.parse(data).user : null;
    }
    return false;
};

    export const getToken = () => {
        if (isLoggedIn()) {
          const data = localStorage.getItem("data");
          return data ? JSON.parse(data).jwtToken : null;
        }
        return null;
    };
  