'use client';

import { Button, Flex, Box, Stack, Heading, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { createClient } from "../services/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBackIcon } from '@chakra-ui/icons'

const supabase = createClient();

export default function Register()
{
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();
    const toast = useToast();

    async function signUpNewUser() {
        if (!newEmail) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }

        if (!newPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }

        if (!newEmail || !newPassword) {
            toast({
                title: 'Error',
                description: 'Todos los campos son obligatorios.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        try {
            const { data, error } = await supabase.auth.signUp({
                email: newEmail,
                password: newPassword,
                options: {
                    emailRedirectTo: 'http://localhost:3000/login',
                }
            });

            if (error) {
                throw error;
            }

            toast({
                title: 'Registro exitoso',
                description: "Por favor, verifica tu correo electrónico.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            setNewEmail("");
            setNewPassword("");
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Registro fallido, intente de nuevo.',
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
                        <ArrowBackIcon boxSize={6} onClick={() => router.push('/')} />
                    </div>
                    <Heading as="h1" size="lg" textAlign="center">Registrarse</Heading>
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
                        signUpNewUser();
                    }}>Registrarse</Button>
                    <Button colorScheme='purple' onClick={() => router.push('/login')}> Inicio de sesión </Button>
                </Stack>
            </Box>
        </Flex>
    )
}