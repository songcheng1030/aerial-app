import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Group,
  Overlay,
  Select,
  Stack,
  Text,
  Timeline,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { NextPage } from 'next'
import * as React from 'react'
import { EyeOff, FileDescription, Icon, Pencil, Upload } from 'tabler-icons-react'
import { Layout } from '../components/layout'
import { users, useSearchController } from '../lib/state'

const historyActions = ['Uploaded', 'Edited', 'Voided'] as const
type HistoryAction = typeof historyActions[number]

const iconTitle = (id: string, action: HistoryAction): { Icon: Icon; title: React.ReactNode } => {
  switch (action) {
    case 'Uploaded':
      return {
        Icon: Upload,
        title: (
          <>
            Uploaded Document <Anchor onClick={() => {}}>{id}</Anchor>
          </>
        ),
      }
    case 'Edited':
      return {
        Icon: Pencil,
        title: (
          <>
            Edited Data in Document <Anchor onClick={() => {}}>{id}</Anchor>
          </>
        ),
      }
    case 'Voided':
      return {
        Icon: EyeOff,
        title: (
          <>
            Voided Document <Anchor onClick={() => {}}>{id}</Anchor>
          </>
        ),
      }
    default:
      throw Error(`unexpected value for action: ${action}`)
  }
}

const HistoryComp: NextPage = () => {
  const {
    user,
    action,
    start,
    end,
    history,
    touched,
    increaseLimit,
    setFilterHistory,
    clear,
    more,
  } = useSearchController()

  return (
    <Layout>
      <Box sx={({ other }) => ({ maxWidth: other.widths.md })} mr='auto'>
        <Title align='left' order={1} mb='lg'>
          History
        </Title>

        <Stack spacing='lg' mb='lg'>
          <Card shadow='md' p='md' withBorder>
            <Stack spacing='md'>
              <Title order={3}>Search Parameters</Title>
              <Group grow>
                <Select
                  label='User'
                  placeholder='None selected'
                  searchable
                  clearable
                  data={users}
                  {...user.formProps}
                />
                <Select
                  label='Action'
                  placeholder='None selected'
                  searchable
                  clearable
                  data={historyActions as unknown as HistoryAction[]}
                  {...action.formProps}
                />
              </Group>
              <Group grow>
                <DatePicker placeholder='None selected' label='Start Date' {...start.formProps} />
                <DatePicker placeholder='None selected' label='End Date' {...end.formProps} />
              </Group>
              <Group position='right'>
                <Button variant='outline' onClick={clear}>
                  Clear
                </Button>
                <Button onClick={setFilterHistory} disabled={!touched}>
                  Search
                </Button>
              </Group>
            </Stack>
          </Card>

          <Card shadow='md' p='md' withBorder>
            {touched && <Overlay opacity={0.1} color='#000' zIndex={5} />}
            <Group position='apart'>
              <Title order={3}>Search Results</Title>
              <Button leftIcon={<FileDescription />}>Generate Report</Button>
            </Group>

            <Timeline active={history.length} bulletSize={24} lineWidth={2} my='xl'>
              {history.map(({ user: _user, action: _action, id, date }) => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const { Icon, title } = iconTitle(id, _action)
                return (
                  <Timeline.Item bullet={<Icon size={12} />} title={title} key={id}>
                    <Text color='dimmed' size='sm'>
                      {_user}
                    </Text>
                    <Text size='xs' mt={4}>
                      {date.toLocaleString()}
                    </Text>
                  </Timeline.Item>
                )
              })}
            </Timeline>
            <Center>
              <Button onClick={increaseLimit} disabled={!more}>
                Load More ...
              </Button>
            </Center>
          </Card>
        </Stack>
      </Box>
    </Layout>
  )
}

export default HistoryComp
