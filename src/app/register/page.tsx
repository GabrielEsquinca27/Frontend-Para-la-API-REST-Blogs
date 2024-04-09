'use client';

import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { createClient } from "../services/supabase";
import { useState } from "react";

const supabase = createClient();

export default function Login()
{
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    async function signUpNewUser() {
        const { data, error } = await supabase.auth.signUp({
          email: newEmail,
          password: newPassword,
          options: {
            emailRedirectTo: 'http://localhost:3000/login',
          }
        })
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
                    signUpNewUser();
                }}>Register</Button>
                
            </div>
        </Flex>
    )
}
