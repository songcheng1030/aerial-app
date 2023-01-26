import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Header,
  Loader,
  Menu,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useAuthUser } from '@react-query-firebase/auth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ChevronDown, Plus, Search } from 'tabler-icons-react'
import { auth } from '../../lib/firebase'
import { useSearchQuery } from '../../lib/queryParams'
import { AccountMenu, CompanyMenu } from './menu'

const SearchComp: React.FC = () => {
  const ref = React.useRef<HTMLInputElement>(null)
  const router = useRouter()
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const query = ref.current?.value
    if (!query) return false
    return router.push(`/search?q=${query}`)
  }

  const queryQP = useSearchQuery()

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        icon={<Search />}
        placeholder='Search all documents'
        size='md'
        sx={{ width: 576 }}
        ref={ref}
        defaultValue={queryQP ?? undefined}
      />
    </form>
  )
}

const MenuItem: React.FC<{ text: string; count: number }> = ({ text, count }) => {
  return (
    <Group position='apart' grow p='sm'>
      <Text weight={600} color='primary'>
        {text}
      </Text>
      <Text align='right'>{count}</Text>
    </Group>
  )
}

const IngestionMenu: React.FC = ({ children }) => {
  return (
    <Menu
      position='bottom'
      placement='end'
      shadow='lg'
      control={<UnstyledButton>{children}</UnstyledButton>}
      gutter={24}
      size={250}
      trigger='hover'
      styles={{
        itemIcon: {
          color: 'primary',
        },
      }}
    >
      <Menu.Label>Documents imported by source</Menu.Label>
      <MenuItem text='Gmail' count={40} />
      <MenuItem text='DocuSign' count={120} />
      <MenuItem text='Uploaded' count={24} />
      <Divider my='xs' />
      <MenuItem text='Total' count={184} />
      <Button compact leftIcon={<Plus />} m='sm'>
        Add Source
      </Button>
    </Menu>
  )
}

export const AppHeader: React.FC = () => {
  const { data } = useAuthUser(['user'], auth)
  const photoUrl = data?.photoURL

  return (
    <Header height={64}>
      <Group position='apart' align='center' sx={{ height: '100%' }}>
        <Box sx={({ other }) => ({ width: other.navbarWidth })} px='sm'>
          <Image src='/logo.svg' alt='Aerial Ops Logo' width={180} height={40} />
        </Box>
        <CompanyMenu selected='Seed, Inc.'>
          <Group spacing='xs'>
            <ChevronDown size={14} />
            <Text>Seed, Inc.</Text>
          </Group>
        </CompanyMenu>
        <Box mx='auto'>
          <SearchComp />
        </Box>

        <IngestionMenu>
          <Badge mr='md' size='xl' variant='dot' sx={{ cursor: 'inherit' }}>
            184
          </Badge>
        </IngestionMenu>

        <Box px='sm'>
          <AccountMenu>
            <Group spacing='sm'>
              <Group spacing='xs'>
                <Text>{data?.displayName ?? 'Loading'}</Text>
                <ChevronDown size={14} />
              </Group>
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  width={36}
                  height={36}
                  style={{ borderRadius: '100%' }}
                  alt='User Avatar'
                />
              ) : (
                <Loader size={36} />
              )}
            </Group>
          </AccountMenu>
        </Box>
      </Group>
    </Header>
  )
}
