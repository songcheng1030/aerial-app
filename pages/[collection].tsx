import { Anchor, Box, Breadcrumbs, Text, Title } from '@mantine/core'
import { NextLink } from '@mantine/next'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '../components/layout'
import { TopPath, topPaths, topRouteMap } from '../components/route'

type Params = {
  collection: TopPath
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: topPaths.map((collection): { params: Params } => ({
      params: {
        collection,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = () => {
  return { props: {} }
}

const PageComp: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = () => {
  const router = useRouter()
  const { collection } = router.query as Params
  const topRoute = topRouteMap[collection]

  const breadCrumbsItems = [
    { link: '/summary', title: 'Summary' },
    { title: topRoute.name, current: true },
  ].map(({ link, title, current }) =>
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
          {topRoute.name}
        </Title>
        <Breadcrumbs mb='lg' separator='›'>
          {topRoute.collection === 'summary' ? breadCrumbsItems.slice(1) : breadCrumbsItems}
        </Breadcrumbs>
        {topRoute.node}
      </Box>
    </Layout>
  )
}

export default PageComp
