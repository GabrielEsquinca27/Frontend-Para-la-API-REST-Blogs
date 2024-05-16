'use client';

import { useAuthContext } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

function Layout({ children }: { children: ReactNode }) {

    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        console.log('isLoggedIn', isLoggedIn);
        if (!isLoggedIn) {
            redirect('/login');
        }
    }, [isLoggedIn]);

    return <div>{children}</div>
}

export default Layout;
