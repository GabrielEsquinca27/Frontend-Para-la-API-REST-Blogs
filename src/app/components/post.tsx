import { Card, CardHeader, CardBody, CardFooter, Text, Image, Stack, Heading, Divider, Button } from '@chakra-ui/react'

export default function Post(props: any) {
    return (
        <Card>
            <CardBody>
                <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    style={{ width: '100%', height: '20rem', objectFit: 'cover'}}
                />
                <Stack mt='6' spacing='3'>
                    <Heading>{ props.post.title }</Heading>
                    <Text>{ props.post.content }</Text>
                </Stack>
            </CardBody>
            <Divider></Divider>
            <CardFooter>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'end'}}>
                    <Button colorScheme='teal'>Leer completo</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
