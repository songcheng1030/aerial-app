import { Button, Center, Group, LoadingOverlay, Stack, Text, Title } from '@mantine/core'
import { useAuthUser } from '@react-query-firebase/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'

const provider = new GoogleAuthProvider()

export const Login: React.FC = () => {
  const { data, isLoading } = useAuthUser(['user'], auth)
  const router = useRouter()
  if (!isLoading && data) {
    router.push('/')
  }

  return (
    <Center sx={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Stack sx={{ width: 360 }} spacing='lg'>
        <Center>
          <Image width={60} height={60} src='/favicon.ico' />
        </Center>
        <Center>
          <Title order={2}>Welcome to Aerial!</Title>
        </Center>
        <Button size='lg' onClick={() => signInWithPopup(auth, provider)}>
          <Group>
            <Image
              width={24}
              height={24}
              src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
            />
            <Text>Continue with Google</Text>
          </Group>
        </Button>
      </Stack>
    </Center>
  )
}

export const LoginRequired: React.FC = ({ children }) => {
  const { data, isLoading } = useAuthUser(['user'], auth)

  if (isLoading) {
    return <LoadingOverlay visible overlayOpacity={0.5} />
  }

  if (data) {
    return <>{children}</>
  }

  return <Login />
}
