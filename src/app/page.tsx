'use client';

import { css } from "@emotion/react";
import styles from "./page.module.css";
import Post from "./components/post";
import { Heading } from "@chakra-ui/react";

import { createClient } from "./services/supabase";
import { useEffect, useState } from "react";

const supabase = createClient();

export default function Home() {

  const [posts, setPosts] = useState<any>([]);

  async function fetchPosts () {
    const { data, error } = await supabase
      .from('blog')
      .select()

    if (error) {
      console.log(error);
      return ;
    }

    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  

  return (
    <main className={styles.main}>
      <div className={styles.description} style={{ marginBottom: "1rem" }}>
        <Heading>Blog personal</Heading>
      </div>

      {posts.map((post: any) => {
        return <Post key={post.id} post={post}></Post>
      })}

    </main>
  );
}
