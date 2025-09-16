'use client';

import React, { useState, useEffect, ReactNode } from "react";
import UserContext from "@/context/UserContext";
import { getCurrentUserDetail } from "@/app/(auth)";
import { User } from "@/utils/user-service";

interface UserProviderProps {
    children: ReactNode;
  }

function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>({
            id: 0, // Default values
            name: "",
            email: "",
            about: "",
            roles: []
    });

    

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
