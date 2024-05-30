'use client';

import { Box, Stack, Heading, Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { loginService } from "../services/auth";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ArrowBackIcon } from '@chakra-ui/icons'

export default function Login()
{
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const authContext = useAuthContext();
    const router = useRouter();
    const toast = useToast()

    async function signIn() {
        try {
            const response = await loginService(newEmail, newPassword);
            console.log(response);
            authContext.login(response);
            toast({
                title: '¡Bienvenido!',
                description: "Inicio de sesión exitoso.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            router.push('/');
        } catch (error) {
            toast({
                title: 'Error',
                description: "Error al iniciar sesión.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return (
        <Flex height="100vh" justify="center" alignItems="center" bg="gray.300">
            <Box w="24rem" p="2rem" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
                <Stack spacing={4}>
                    <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <ArrowBackIcon boxSize={6} onClick={() => router.push('/')}/>
                    </div>
                    <Heading as="h1" size="lg" textAlign="center">Iniciar sesión</Heading>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme='purple' variant="outline" borderWidth="2px" mt={4} onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        signIn();
                    }}>Iniciar sesión</Button>
                    <Button colorScheme='purple' onClick={() => router.push('/register')}> Registrarse </Button>
                </Stack>
            </Box>
        </Flex>
    );
}