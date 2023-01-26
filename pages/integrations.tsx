import { Badge, Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import Image from 'next/image'
import React from 'react'
import { Layout } from '../components/layout'

type IConnection = {
  name: string
  blurb: string
  logoUrl: string
  installed?: boolean
}

const Connection: React.FC<IConnection> = ({ name, blurb, logoUrl, installed }) => {
  return (
    <Card
      sx={(theme) => ({
        width: 300,
        border: `1px solid ${theme.colors.gray[2]}`,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows.md,
          transition: 'box-shadow 0.3s ease-in-out',
        },
      })}
      radius='sm'
      p='lg'
    >
      <Card.Section>
        <Image
          src={logoUrl}
          alt='Gusto Logo'
          width={300}
          height={200}
          objectFit='cover'
          objectPosition='center'
        />
      </Card.Section>
      <Stack spacing='sm' mt='lg'>
        <Group position='apart'>
          <Text weight={600}>{name}</Text>
          {installed ? (
            <Badge variant='light'>Installed</Badge>
          ) : (
            <Badge color='green'>Available</Badge>
          )}
        </Group>
        {!installed && <Button color='green'>Connect</Button>}
        <Text>{blurb}</Text>
      </Stack>
    </Card>
  )
}

const connections: IConnection[] = [
  {
    name: 'Gusto',
    blurb:
      "Gusto's people platform helps growing businesses onboard, pay, insure, and support their hardworking teams with payroll, benefits, and more.",
    logoUrl: '/logo/gusto.jpeg',
  },
  {
    name: 'Carta',
    blurb:
      'Carta (formerly eShares) is an ownership and equity management platform trusted by thousands of founders, investors, and employees.',
    logoUrl: '/logo/carta.png',
  },
  {
    name: 'Docusign',
    blurb:
      'Connect your Docusign account to automatically download and organize all your legal agreements in Aerial.',
    logoUrl: '/logo/docusign.png',
    installed: true,
  },
  {
    name: 'Gmail',
    blurb:
      'Connect your Gmail account to automatically download and organize all your legal agreements in Aerial.',
    logoUrl: '/logo/gmail.webp',
    installed: true,
  },
  {
    name: 'Google Workspace',
    blurb:
      "Google Workspace's (formerly G Suite) is a suite of collaboration and productivity apps for businesses of all sizes. Includes Gmail, Drive, Meet and more.",
    logoUrl: '/logo/google.jpeg',
    installed: false,
  },
  {
    name: 'Justworks',
    blurb:
      'Justworks provides small and medium-sized businesses with simple software and expert support for payroll, benefits, HR, and compliance.',
    logoUrl: '/logo/justworks.webp',
  },
  {
    name: 'Zenefits',
    blurb:
      'Zenefits is an award-winning People Ops Platform that makes it easy to manage your employee documents, HR, benefits, payroll, time and attendance.',
    logoUrl: '/logo/zenefits.webp',
  },
  {
    name: 'Rippling',
    blurb:
      'Rippling brings together Payroll, Benefits, HR, IT, and more so you can manage all your employee operations in one place—from onboarding to offboarding.',
    logoUrl: '/logo/rippling.png',
  },
]

const IntegrationsComp: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ maxWidth: 992 }} mr='auto'>
        <Group my='lg' position='apart' align='flex-start'>
          <Title align='left' order={1}>
            Integrations
          </Title>
        </Group>
        <Title order={2} my='xl'>
          Installed
        </Title>
        <Group spacing='xl' align='flex-start' mb='xl'>
          {connections
            .filter(({ installed }) => installed)
            .map((conn, key) => (
              <Connection {...conn} key={key} />
            ))}
        </Group>

        <Title order={2} my='xl'>
          Available
        </Title>
        <Group spacing='xl' align='flex-start' mb='xl'>
          {connections
            .filter(({ installed }) => !installed)
            .map((conn, key) => (
              <Connection {...conn} key={key} />
            ))}
        </Group>
      </Box>
    </Layout>
  )
}

export default IntegrationsComp
