'use client';

import styles from "./page.module.css";
import Post from "./components/post";
import { Button, Heading, Text } from "@chakra-ui/react";

import { createClient } from "./services/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";

const supabase = createClient();

export default function Home() {
  const useAuth = useAuthContext();
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts () {
    const { data, error } = await supabase
      .from('blog')
      .select('*')

    if (error) {
      console.log("Error fetching posts:", error);
      setLoading(false);
      return ;
    }

    console.log("Fetched posts:", data);
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <main className={styles.main}>
      <div className={styles.description} style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Heading>Blog personal</Heading>
        <div style={{ display: "flex", gap: "1rem" }}>
          {useAuth.isLoggedIn ? (
            <>
              <Button colorScheme='yellow' borderWidth="2px" borderColor="black" onClick={() => router.push('/backoffice/post/create')}>Agregar Post</Button>
              <Button colorScheme='red' borderWidth="2px" borderColor="black" onClick={() => router.push('/logout')}>Logout</Button>
            </>
          ) : (
            <>
              <Button colorScheme='blue' borderWidth="2px" borderColor="black" onClick={() => router.push('/login')}>Login</Button>
              <Button colorScheme='green' borderWidth="2px" borderColor="black" onClick={() => router.push('/register')}>Register</Button>
            </>
          )}
        </div>
      </div> 
      {loading ? (
        <Text>Cargando posts...</Text>
      ) : posts.length === 0 ? (
        <Text>No hay posts disponibles.</Text>
      ) : (
        posts.map((post: any) => {
          return <Post key={post.id} post={post} />;
        })
      )}
    </main>
  );
}