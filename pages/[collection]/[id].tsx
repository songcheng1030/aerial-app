import { Anchor, Box, Breadcrumbs, Text, Title } from '@mantine/core'
import { NextLink } from '@mantine/next'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Layout } from '../../components/layout'
import { DetailCollection, detailRouteMap } from '../../components/route/detail'

export const getServerSideProps: GetServerSideProps<{
  id: string
  collection: DetailCollection
}> = async ({ query }) => ({
  props: { id: query.id as string, collection: query.collection as DetailCollection },
})

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  id,
  collection,
}) => {
  const detailData = detailRouteMap[collection]

  const breadCrumbsItems = [
    { title: 'Summary', link: '/summary' },
    { title: detailData.name, link: detailData.backLink },
    { title: 'Detail', current: true },
  ].map(({ title, link, current }) =>
    !current ? (
      <Anchor component={NextLink} href={link}>
        {title}
      </Anchor>
    ) : (
      <Text weight='bold'>{title}</Text>
    )
  )

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200 }} mr='auto'>
        <Title align='left' order={1} mb='lg'>
          {detailData.name} Detail
        </Title>
        <Breadcrumbs mb='lg' separator='›'>
          {breadCrumbsItems}
        </Breadcrumbs>
        {detailData.node(id)}
      </Box>
    </Layout>
  )
}

export default Page
