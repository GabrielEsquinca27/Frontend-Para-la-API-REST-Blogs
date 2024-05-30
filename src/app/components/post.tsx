import { Card, CardBody, CardFooter, Text, Image, Stack, Heading, Divider, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { ArrowForwardIcon } from '@chakra-ui/icons'

export default function Post(props: any) {
    const router = useRouter();

    const readMore = () => {
        router.push(`/post/${props.post.id}`);
    };

    const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return (
        <Card my="3">
            <CardBody>    
                <Image
                    src={`${API_KEY}/storage/v1/object/public/blog_images/${props.post.image_url}`}
                    alt='Imagen del blog'
                    borderRadius='lg'
                    style={{ width: '100%', height: '25rem', objectFit: 'cover'}}
                />                
                <Stack mt='6' spacing='6'>
                    <Heading>{ props.post.title }</Heading>
                    <Text>{ props.post.content.substring(0,250) } .....</Text>
                </Stack>
                <Divider my='4' />
            </CardBody>
            <CardFooter>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'end'}}>
                    <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant="outline" borderWidth="2px" onClick={ readMore }>Seguir leyendo</Button>
                </div>
            </CardFooter>
        </Card>
        
    );
}
