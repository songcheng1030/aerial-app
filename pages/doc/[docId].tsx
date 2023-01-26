import { Box, Title } from '@mantine/core'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { Detail, DocDetail } from '../../components/detail'
import { Layout } from '../../components/layout'

const EditDocumentComp: React.FC = () => {
  const { setUrl, setFullPage } = Detail.useState()

  useEffect(() => {
    setUrl('/sample-contract.pdf')
  }, [setUrl])

  useEffect(() => {
    setFullPage(true)

    return () => {
      setFullPage(false)
    }
  }, [setFullPage])

  return (
    <Box sx={{ maxWidth: 1200 }} mr='auto'>
      <Title align='left' order={1} mb='lg'>
        Edit Document
      </Title>
      <DocDetail />
    </Box>
  )
}

const LayoutWrapper: NextPage = () => (
  <Layout>
    <EditDocumentComp />
  </Layout>
)

export default LayoutWrapper
