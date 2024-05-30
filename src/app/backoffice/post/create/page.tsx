"use client";

import styles from '../../../page.module.css';
import { Card, CardBody, Heading, Textarea, useToast } from "@chakra-ui/react";
import { Button, Flex, Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { createClient } from "../../../services/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBackIcon } from '@chakra-ui/icons'

const supabase = createClient();

export default function Post() {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);
  const [imageFilePath, setImageFilePath] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const toast = useToast();

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user != null) {
        setUserId(user.id);
      } else {
        setUserId("");
      }
    } catch (e) {
      console.error('Error al obtener el usuario:', e);
    }
  }

  async function upload(e: any) {
    let selectedFile = e.target.files[0];
      
    if (!selectedFile) {
      console.error('No se ha seleccionado ningún archivo.');
      toast({
        title: 'Error',
        description: 'No se ha seleccionado ningún archivo.',
        status: 'error',
        isClosable: true,
      });
      e.target.value = null;
      setFile(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(selectedFile.type)) {
      console.error('El archivo seleccionado no es una imagen válida.');
      toast({
        title: 'Error',
        description: 'El archivo seleccionado no es una imagen válida.',
        status: 'error',
        isClosable: true,
      });
      e.target.value = null;
      return;
    }

    const fileExtension = selectedFile.name.split('.').pop();
    const random = Math.floor(Math.random() * 10000);
    const fileName = `${Date.now()}-${random}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    setFile(selectedFile);
    setImageFilePath(filePath);
  }

  async function save() {
    if (!newTitle || !newContent || !file || !publishedAt) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios.',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    console.log('Subiendo una nueva imagen...');
    if (!userId) {
      console.error('El usuario no ha iniciado sesión.');
      toast({
        title: 'Error',
        description: 'El usuario no ha iniciado sesión.',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    if (!file) {
      console.error('No se ha seleccionado ningún archivo.');
      toast({
        title: 'Error',
        description: 'No se ha seleccionado ningún archivo.',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    const { data, error } = await supabase
      .storage.from('blog_images')
      .upload(imageFilePath, file);

    if (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        title: 'Error',
        description: `Error al subir la imagen: ${error.message}`,
        status: 'error',
        isClosable: true,
      });
      return;
    } else {
      console.log('Imagen cargada correctamente: ', data);
    }

    const imageUrl = data.path;
    console.log('Guardando nuevo post...');

    const { error: insertError } = await supabase.from('blog').insert({
      created_at: new Date().toISOString(),
      user_id: userId,
      title: newTitle,
      content: newContent,
      image_url: imageUrl,
      published_at: publishedAt,
      comments: []
    });

    if (insertError) {
      console.error('Error al insertar el post:', insertError);
      toast({
        title: 'Error',
        description: `Error al insertar el post: ${insertError.message}`,
        status: 'error',
        isClosable: true,
      });
      return;
    } else {
      console.log('¡Post publicado correctamente!');
      toast({
        title: 'Éxito',
        description: '¡Post publicado correctamente!',
        status: 'success',
        isClosable: true,
      });
      return router.push('/');
    }
    
  }

  useEffect(() => {
    getUser();
  }, [userId]);

  return (
    <main className={styles.main}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h1" size="lg">Nuevo post</Heading>
        <Button leftIcon={<ArrowBackIcon />} colorScheme='purple' variant="outline" borderWidth="2px" onClick={() => router.back()}>Regresar</Button>
      </Flex>
      <Box>
        <Card>
          <CardBody>
            <FormControl id="title" mb={4}>
              <FormLabel>Título</FormLabel>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </FormControl>
            <FormControl id="content" mb={4}>
              <FormLabel>Contenido</FormLabel>
              <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            </FormControl>
            <FormControl id="image" mb={4}>
              <FormLabel>Imagen</FormLabel>
              <Input type="file" onChange={upload} />
            </FormControl>
            <FormControl id="publishedAt" mb={4}>
              <FormLabel>Fecha de Publicación</FormLabel>
              <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
            </FormControl>
            <Button colorScheme='blue' borderWidth="2px" borderColor="black" onClick={(e) => {
              e.preventDefault();
              save();
            }}>Guardar</Button>
          </CardBody>
        </Card>
      </Box>
    </main>
  );
}