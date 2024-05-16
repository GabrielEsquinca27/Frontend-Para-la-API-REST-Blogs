'use client';

import { useAuthContext } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const { logout } = useAuthContext();

    useEffect(() => {
        logout();
        redirect('/login');
    });

    return null;
}

