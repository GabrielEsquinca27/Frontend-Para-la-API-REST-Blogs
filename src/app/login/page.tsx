'use client';

import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { loginSevice } from "../services/auth";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Login()
{
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const authContext = useAuthContext();
    const router = useRouter();

    async function singIn() {
        const response = await loginSevice(
          newEmail,
          newPassword,
        );
        console.log(response);

        authContext.login(response);
        return router.push('/backoffice/post/create');
    }

    return (
        <Flex height='max-content' justify='center' alignItems='center'>
            <div style={{ width: '24rem' }}>
                <FormControl >
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={newEmail} onChange={(e) => {
                        setNewEmail(e.target.value)
                    }}></Input>
                </FormControl>
                <FormControl>
                    <FormLabel>Pasword</FormLabel>
                    <Input type="password" value={newPassword} onChange={(e) => {
                        setNewPassword(e.target.value)
                    }}></Input>
                </FormControl>
                
                <Button mt={4} colorScheme='blue' onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    singIn();
                }}>Login</Button>
                
            </div>
        </Flex>
    )
}
