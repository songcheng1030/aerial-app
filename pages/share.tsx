import { Avatar, Badge, Box, Button, Group, Menu, Table, Title } from '@mantine/core'
import { NextPage } from 'next'
import React from 'react'
import { DotsVertical, Edit, Trash } from 'tabler-icons-react'
import { Layout } from '../components/layout'
import { NameEmail } from '../components/util'
import { people, People, PermissionLevel, Share } from '../lib/state'

const PermissionBadge: React.FC<{
  permission: PermissionLevel
}> = ({ permission }) => {
  const color = {
    None: 'gray',
    Read: 'blue',
    Edit: 'teal',
  }

  return (
    <Badge color={color[permission]} variant='outline'>
      {permission}
    </Badge>
  )
}

const PermissionTuple: React.FC<{
  permissions: [PermissionLevel, PermissionLevel, PermissionLevel, PermissionLevel]
}> = ({ permissions }) => {
  return (
    <>
      {permissions.map((permission, key) => (
        <td key={key}>
          <PermissionBadge permission={permission} />
        </td>
      ))}
    </>
  )
}

const Row: React.FC<People & Share> = ({ photo, name, email, lastUsed, permission }) => {
  return (
    <tr>
      <td style={{ paddingRight: 0 }}>
        <Avatar src={photo} radius='xl' />
      </td>
      <td>
        <NameEmail
          name={name}
          email={email}
          role={
            permission.type === 'admin' ? (
              <Badge variant='light'>Admin</Badge>
            ) : permission.type === 'dataroom' ? (
              <Badge variant='light'>Dataroom</Badge>
            ) : undefined
          }
        />
      </td>
      <td>{lastUsed}</td>
      {permission.type === 'admin' ? (
        <PermissionTuple permissions={['Edit', 'Edit', 'Edit', 'Edit']} />
      ) : permission.type === 'dataroom' ? (
        <PermissionTuple permissions={['Read', 'Read', 'Read', 'Read']} />
      ) : (
        <PermissionTuple
          permissions={[
            permission.corporate,
            permission.personnel,
            permission.equity,
            permission.customer,
          ]}
        />
      )}
      <td>
        <Group position='right'>
          <Menu
            position='bottom'
            placement='end'
            control={
              <Button variant='subtle' size='xs' px='xs'>
                <DotsVertical size={20} />
              </Button>
            }
          >
            <Menu.Label>User Actions</Menu.Label>
            <Menu.Item sx={(theme) => ({ color: theme.colors.gray[8] })} icon={<Edit size={14} />}>
              Edit Permissions
            </Menu.Item>
            <Menu.Item color='red' icon={<Trash size={14} />}>
              Delete User
            </Menu.Item>
          </Menu>
        </Group>
      </td>
    </tr>
  )
}

const Sharing: NextPage = () => {
  const users = people.flatMap((p) => (p.share ? [{ ...p, ...p.share }] : []))

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200 }} mr='auto'>
        <Group my='lg' position='apart' align='flex-start'>
          <Title align='left' order={1}>
            Share Settings
          </Title>
        </Group>

        <Table>
          <thead>
            <tr>
              <th />
              <th>User</th>
              <th>Last Used</th>
              <th>Corporate</th>
              <th>Personnel</th>
              <th>Equity</th>
              <th>Customer</th>
              <th>
                <Button size='sm'>Share</Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, key) => (
              <Row {...user} key={key} />
            ))}
          </tbody>
        </Table>
      </Box>
    </Layout>
  )
}

export default Sharing
