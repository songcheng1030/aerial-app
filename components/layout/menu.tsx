import { ActionIcon, Menu, UnstyledButton } from '@mantine/core'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'
import {
  CreditCard,
  DatabaseExport,
  Edit,
  Help,
  Logout,
  Plug,
  Share,
  User,
} from 'tabler-icons-react'
import { auth } from '../../lib/firebase'

interface MenuItemProps {
  icon: React.ReactNode
  path?: string
  text: string
  onClick?: (router: NextRouter) => void | Promise<void>
}

const menuItems: MenuItemProps[] = [
  { icon: <Share />, path: 'share', text: 'Share' },
  { icon: <DatabaseExport />, text: 'Export Zip Archive' },
  { icon: <Edit />, text: 'Template Form' },
  { icon: <Plug />, path: 'integrations', text: 'Integrations' },
]

const accountItems: MenuItemProps[] = [
  { icon: <User />, text: 'Account' },
  { icon: <CreditCard />, text: 'Billing' },
  { icon: <Help />, text: 'Help' },
  {
    icon: <Logout />,
    text: 'Logout',
    onClick: async (router: NextRouter) => {
      await signOut(auth)
      await router.push('/login')
    },
  },
]

const MenuItem: React.FC<MenuItemProps> = ({ icon, path, text, onClick }) => {
  const router = useRouter()
  return (
    <Menu.Item
      icon={
        <ActionIcon
          sx={(theme) => ({
            color: !path ? theme.colors.inactive[5] : 'primary',
          })}
          size='md'
        >
          {icon}
        </ActionIcon>
      }
      disabled={!path && !onClick}
      onClick={
        onClick &&
        ((e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          onClick(router)
        })
      }
    >
      <Link href={`/${path}`}>{text}</Link>
    </Menu.Item>
  )
}

export const AccountMenu: React.FC = ({ children }) => {
  return (
    <Menu
      position='bottom'
      placement='end'
      shadow='lg'
      control={<UnstyledButton>{children}</UnstyledButton>}
      gutter={24}
      size={220}
      trigger='hover'
    >
      <Menu.Label>Actions</Menu.Label>
      {menuItems.map((item, key) => (
        <MenuItem {...item} key={key} />
      ))}
      <Menu.Label>Account</Menu.Label>
      {accountItems.map((item, key) => (
        <MenuItem {...item} key={key} />
      ))}
    </Menu>
  )
}

export const CompanyMenu: React.FC<{ selected: string }> = ({ selected, children }) => {
  const companies = ['Garage Gals, Inc.', 'PreSeed, Inc.', 'Seed, Inc.']

  return (
    <Menu
      position='bottom'
      placement='start'
      shadow='lg'
      control={<UnstyledButton>{children}</UnstyledButton>}
      gutter={24}
      size={220}
      trigger='hover'
    >
      {companies.map((company, key) => (
        <Menu.Item key={key} disabled={company === selected}>
          {company}
        </Menu.Item>
      ))}
    </Menu>
  )
}
