import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Checkbox,
  Collapse,
  Group,
  Modal,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { NextLink } from '@mantine/next'
import React from 'react'
import { ArrowsDiagonal, Calendar } from 'tabler-icons-react'
import { Random } from '../../lib/random'
import { docTypeStr } from '../../lib/schema'
import { contentfulDocTypes } from '../../lib/schema/typeMap'
import { people } from '../../lib/state'
import { DocDrop } from './drop'
import { ModalState, modalZIndex } from './state'
import { DocView } from './view'

export { DocDrop } from './drop'

const useCounterParty = () => {
  const initialCounterParties = people.map(({ id, name, email }) => ({
    id,
    name,
    email,
  }))

  const random = new Random(1)

  const [counterParties, setCounterParty] = React.useState(initialCounterParties)
  return {
    counterParties,
    addCounterParty: (name: string) =>
      setCounterParty((current) => [...current, { id: random.randomString(20), name, email: '' }]),
  }
}

const CounterParty: React.FC = () => {
  const { counterParties, addCounterParty } = useCounterParty()
  const [editEmail, setEditEmail] = React.useState(false)

  return (
    <>
      <Select
        label='Counter Party'
        placeholder='None selected'
        searchable
        clearable
        data={counterParties.map(({ id, name }) => ({
          label: name,
          value: id,
        }))}
        required
        zIndex={modalZIndex + 1}
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(label) => {
          addCounterParty(label)
          setEditEmail(true)
        }}
      />
      <Collapse in={editEmail}>
        <TextInput type='email' label='Counter Party Email' />
      </Collapse>
      <Anchor onClick={() => setEditEmail((x) => !x)}>
        <Text size='xs'>{editEmail ? 'Discard Edits' : 'Edit Email'}</Text>
      </Anchor>
    </>
  )
}

const Properties: React.FC = () => {
  return (
    <Stack spacing='xs'>
      <Select
        label='Type'
        placeholder='None selected'
        searchable
        clearable
        data={contentfulDocTypes.map((type) => ({
          value: type,
          label: docTypeStr(type),
        }))}
        filter={(value, item) =>
          item.label!.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.label === 'Miscellaneous'
        }
        required
        zIndex={modalZIndex + 1}
      />
      <CounterParty />
      <DatePicker
        required
        label='Effective Date'
        firstDayOfWeek='sunday'
        allowFreeInput
        icon={<Calendar size={16} />}
        zIndex={modalZIndex + 1}
      />
      <Box>
        <DatePicker
          disabled
          label='Expiration Date'
          firstDayOfWeek='sunday'
          allowFreeInput
          icon={<Calendar size={16} />}
          zIndex={modalZIndex + 1}
        />

        <Checkbox mt='xs' label='No expiration date' />
      </Box>
    </Stack>
  )
}

const Terms: React.FC = () => {
  const { close, save } = ModalState.useContainer()
  return (
    <Stack sx={{ width: 280, minHeight: '100%' }} justify='space-between'>
      <Tabs tabPadding='md'>
        <Tabs.Tab label='Properties'>
          <Properties />
        </Tabs.Tab>
        <Tabs.Tab label='Relations'>Relations</Tabs.Tab>
      </Tabs>

      <Group position='right' mt='md'>
        <Button variant='subtle' color='gray' onClick={close}>
          Cancel
        </Button>
        <Button type='submit' onClick={save}>
          Save
        </Button>
      </Group>
    </Stack>
  )
}

export const DocDetail: React.FC = () => {
  const { url } = ModalState.useContainer()

  return (
    <Group
      sx={{
        width: '100%',
        height: '75vh',
      }}
      align='stretch'
      spacing='lg'
    >
      <Box sx={{ flex: 'auto', height: '100%' }}>{url ? <DocView url={url} /> : <DocDrop />}</Box>
      <Terms />
    </Group>
  )
}

const ModalComp: React.FC = () => {
  const { close, isOpen, url } = ModalState.useContainer()
  return (
    <Modal
      title={
        <Group>
          {url !== undefined ? 'Edit Document' : 'Upload Document'}
          <ActionIcon component={NextLink} href={url ? '/doc/12345abcde' : '/doc/new'} color='gray'>
            <ArrowsDiagonal />
          </ActionIcon>
        </Group>
      }
      opened={isOpen}
      onClose={close}
      size={1200}
      zIndex={modalZIndex}
      overlayColor='gray'
      overlayOpacity={0.5}
      overlayBlur={3}
    >
      <DocDetail />
    </Modal>
  )
}

const Provider: React.FC = ({ children }) => {
  return (
    <ModalState.Provider>
      <ModalComp />
      {children}
    </ModalState.Provider>
  )
}

export const Detail = {
  Provider,
  useState: ModalState.useContainer,
}
