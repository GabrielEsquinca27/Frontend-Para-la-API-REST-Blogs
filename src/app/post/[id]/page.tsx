'use client';

import { Card, CardBody, CardHeader, Stack, Spinner, Center, StackDivider, Heading, Text, Button, Image, Box, Divider, Textarea, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "./../../services/supabase";
import { useAuthContext } from "@/contexts/authContext";
import { ArrowBackIcon } from '@chakra-ui/icons'

const supabase = createClient();

export default function PostDetail({ params }: { params: { id: string } }) {
  const useAuth = useAuthContext();
  const { id } = params;
  const [post, setPost] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [comment, setComment] = useState('');
  const router = useRouter();
  const toast = useToast()

  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_URL;

  /*const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user != null) {
        setUserId(user.id);
      } else {
        setUserId("");
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }
  }*/

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user != null) {
        setUserId(user.id);
      } else {
        setUserId("");
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }
  }
  

  async function postDetails() {
    const { data, error } = await supabase
      .from('blog')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.log("Error al obtener los detalles del post:", error);
      setLoading(false);
      return;
    }

    console.log("Detalles del post recuperado:", data);
    setPost(data);
    setComments(data.comments || []);
    setLoading(false);
  }

  
  async function addComment() {
    if (!comment) {
      toast({
        title: 'Error',
        description: "El comentario no puede estar vacío.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const newComment = {
      user_id: userId,
      user_name: 'Anónimo',
      comment: comment,
    };

    const updatedComments = [...comments, newComment];


    const { data, error } = await supabase
      .from('blog')
      .update({ comments: updatedComments })
      .eq('id', id)
      .select()

    if (error) {
      console.log("Error al agregar el comentario:", error);
      alert("Error al agregar el comentario.");
      return;
    }

    setComments(updatedComments);
    setComment('');
  }
  
  useEffect(() => {
    postDetails();
    getUser();
  }, [id]);

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {loading ? (
        <>
          <Stack>
            <Center height="100vh">
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />
              </Center>                
          </Stack>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button leftIcon={<ArrowBackIcon />} colorScheme='purple' variant="outline" borderWidth="2px" onClick={() => router.back()}>Regresar</Button>
              {useAuth.isLoggedIn ? (
                <>
                  <Button colorScheme='red' borderWidth="2px" borderColor="black" onClick={() => router.push('/logout')}>Logout</Button>
                </>
              ) : (
                <>
                  <Button colorScheme='blue' borderWidth="2px" borderColor="black" onClick={() => router.push('/login')}>Login</Button>
                </>
              )}
          </div>
          <div>
            <Card>
              <CardBody>
                <Heading>{post.title}</Heading>
                <Image mt={8}
                  src={`${API_KEY}/storage/v1/object/public/blog_images/${post.image_url}`}
                  alt='Imagen del blog'
                  borderRadius='lg'
                  style={{ width: '100%', height: '25rem', objectFit: 'cover'}}
                />   
                <Text mt={8}>{post.content}</Text>
              </CardBody>
            </Card>
          </div>
          <Divider my="6" />
          <Card>
            <CardHeader>
              <Heading as="h2" size="lg">Comentarios</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Box key={index}>
                      <Heading size='xs' textTransform='uppercase'>
                        { comment.user_name }
                      </Heading>
                      <Text pt='2' fontSize='md'>
                        { comment.comment }
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text>No hay comentarios aún.</Text>
                )}
              </Stack>
              <Divider my="6" />
              <Heading as="h3" size="md" mb="4">Agregar un comentario</Heading>
              {useAuth.isLoggedIn ? (
                <>
                  <Textarea
                    placeholder="Escribe tu comentario aquí..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    mb="4"
                  />
                  <Button colorScheme="teal" onClick={addComment}>Enviar comentario</Button>
                </>
              ) : (
                <>
                  <Text mt={6}>Para dejar un comentario, haz clic en el botón de abajo para iniciar sesión.</Text>
                  <Button mt={6} colorScheme='blue' borderWidth="2px" borderColor="black" onClick={() => router.push('/login')}>Iniciar sesión</Button>
                </>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </main>
  );
}