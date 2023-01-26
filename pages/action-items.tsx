import { Box, Button, Group, Stack, Switch, Title } from '@mantine/core'
import React from 'react'
import { FileDescription } from 'tabler-icons-react'
import { DocGroupComp, MissingDocComp } from '../components/doc'
import { Layout } from '../components/layout'
import { actionItems } from '../lib/state'

const ActionItemsPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={({ other }) => ({ maxWidth: other.widths.md })} mr='auto'>
        <Group my='lg' position='apart' align='flex-start'>
          <Title align='left' order={1}>
            Action Items
          </Title>
          <Button leftIcon={<FileDescription />}>Generate Report</Button>
        </Group>
        <Switch label='Show dismissed' />
        <Stack spacing='xl' py='xl'>
          <MissingDocComp type='CORPORATE_BYLAWS' />
          {actionItems.map((docGroup, key) => (
            <DocGroupComp docGroup={docGroup} key={key} />
          ))}
        </Stack>
      </Box>
    </Layout>
  )
}

export default ActionItemsPage
