'use client';

import { createContext } from "react";

import { User } from "@/utils/user-service";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
