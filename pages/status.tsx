import { Box, Loader, Table, Text, Title } from '@mantine/core'
import { useAuthUser } from '@react-query-firebase/auth'
import { IdTokenResult } from 'firebase/auth'
import { NextPage } from 'next'
import React from 'react'
import { Layout } from '../components/layout'
import { auth } from '../lib/firebase'
import { trpc } from '../lib/trpc.front'

const TrpcStatus: React.FC = () => {
  const { isLoading, data } = trpc.useQuery(['hello', { text: 'client' }])

  if (isLoading) {
    return (
      <Text>
        Loading ... <Loader size='sm' />
      </Text>
    )
  }

  if (!data) {
    return <Text>Error...</Text>
  }

  return <Text>Received: {data.greeting}</Text>
}

const useIdToken = () => {
  const { data } = useAuthUser(['user'], auth)
  const [idToken, setIdToken] = React.useState<IdTokenResult | null>(null)
  React.useEffect(() => {
    if (data) {
      data.getIdTokenResult().then(setIdToken)
    }
  })
  return { data: idToken, isLoading: !idToken }
}

const LoginStatus: React.FC = () => {
  const { data, isLoading } = useIdToken()
  if (isLoading) {
    return (
      <Text>
        Loading ... <Loader size='sm' />
      </Text>
    )
  }

  if (!data) {
    return <Text>Error...</Text>
  }

  return <Text>Received: {JSON.stringify(data.claims)}</Text>
}

const StatusPage: NextPage = () => {
  return (
    <Layout>
      <Box sx={{ maxWidth: 600 }} mr='auto'>
        <Title align='left' order={1} mb='lg'>
          Status
        </Title>
        <Table striped>
          <tr>
            <td>Trpc Status:</td>
            <td>
              <TrpcStatus />
            </td>
          </tr>
          <tr>
            <td>User Status:</td>
            <td>
              <LoginStatus />
            </td>
          </tr>
        </Table>
      </Box>
    </Layout>
  )
}

export default StatusPage
