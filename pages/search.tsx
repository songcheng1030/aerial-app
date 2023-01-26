import { Box, Stack, Text } from '@mantine/core'
import { NextPage } from 'next'
import { DocGroupComp } from '../components/doc'
import { Layout } from '../components/layout'
import { useSearchQuery } from '../lib/queryParams'
import { DocGroup } from '../lib/state'

const SearchComp: NextPage = () => {
  const query = useSearchQuery()

  return (
    <Layout>
      <Box sx={{ maxWidth: 992 }} mr='auto'>
        {(() => {
          if (!query) {
            return (
              <Text size='lg' color='dimmed'>
                Query Needed
              </Text>
            )
          }

          const docGroups = DocGroup.search(query)

          if (docGroups.length > 0) {
            return (
              <>
                <Text size='xl' color='dimmed'>
                  Search results for &quot;{query}&quot;
                </Text>
                <Stack spacing='xl' py='xl'>
                  {docGroups.map((docGroup, key) => (
                    <DocGroupComp docGroup={docGroup} key={key} />
                  ))}
                </Stack>
              </>
            )
          }

          return (
            <Text size='xl' color='dimmed' mb='lg'>
              No search results for &quot;{query}&quot;.
            </Text>
          )
        })()}
      </Box>
    </Layout>
  )
}

export default SearchComp
