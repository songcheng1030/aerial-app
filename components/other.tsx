import { Center, Notification, Stack } from '@mantine/core'
import React from 'react'
import { DocGroup } from '../lib/state'
import { DocGroupComp } from './doc'

export const Processing: React.FC = () => {
  return (
    <>
      <Center sx={({ other }) => ({ maxWidth: other.widths.md })} mr='auto'>
        <Notification
          loading
          title='Aerial is processing these documents'
          sx={{ backgroundColor: 'white' }}
          disallowClose
        >
          You can manually categorize them.
          <br />
          If you wait, Aerial will process them for you.
        </Notification>
      </Center>

      <Stack spacing='xl' my='xl'>
        {DocGroup.query({ type: 'PROCESSING' }).map((docGroup, key) => (
          <DocGroupComp docGroup={docGroup} key={key} />
        ))}
      </Stack>
    </>
  )
}
