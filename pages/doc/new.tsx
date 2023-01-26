import { Box, Title } from '@mantine/core'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { Detail, DocDetail } from '../../components/detail'
import { Layout } from '../../components/layout'

const NewDocumentComp: React.FC = () => {
  const { setFullPage } = Detail.useState()

  useEffect(() => {
    setFullPage(true)

    return () => {
      setFullPage(false)
    }
  }, [setFullPage])

  return (
    <Box sx={{ maxWidth: 1200 }} mr='auto'>
      <Title align='left' order={1} mb='lg'>
        Upload Document
      </Title>
      <DocDetail />
    </Box>
  )
}

const LayoutWrapper: NextPage = () => (
  <Layout>
    <NewDocumentComp />
  </Layout>
)

export default LayoutWrapper
