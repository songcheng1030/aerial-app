import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Notification,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import Link from 'next/link'
import * as React from 'react'
import {
  AlertOctagon,
  Ballpen,
  CircleCheck,
  FileAlert,
  FileDownload,
  Upload,
} from 'tabler-icons-react'
import { Metadata } from '../../lib/schema'
import { fileName } from '../../lib/util'
import { DocDrop } from '../detail'
import { useHoverChildAppear } from './hook'

export const SignatureButton: React.FC<{ signatureLink: string | null }> = ({ signatureLink }) => {
  if (signatureLink) {
    return (
      <Tooltip label='Link to signature page'>
        <Link href={signatureLink} passHref>
          <Button size='sm' compact color='urgent'>
            <Group spacing='xs'>
              <Ballpen size={14} /> <Text size='xs'>Sign</Text>
            </Group>
          </Button>
        </Link>
      </Tooltip>
    )
  }

  return <Badge color='green'>✓ Signed</Badge>
}

export const OptLink: React.FC<{ href?: string }> = ({ href, children }) => {
  if (href) {
    return <Link href={href}>{children}</Link>
  }
  return <>{children}</>
}

export const UrgentButton: React.FC<{
  onClick?: () => void
  text?: string
}> = ({ onClick, text = 'Upload' }) => {
  return (
    <Button color='urgent' onClick={onClick} leftIcon={<Upload size={18} />}>
      {text}
    </Button>
  )
}

export const ClickableTooltip: React.FC<{
  label: string
  clickedLabel: string
  children: (_: { clicked: boolean }) => React.ReactNode
}> = ({ label, clickedLabel, children }) => {
  const [clicked, setClicked] = React.useState(false)
  return (
    <Tooltip label={clicked ? clickedLabel : label} color={clicked ? 'primary' : undefined}>
      <Box
        onClick={() => {
          setClicked(true)
          setTimeout(() => setClicked(false), 2000)
        }}
      >
        {children({ clicked })}
      </Box>
    </Tooltip>
  )
}

export const download = (url: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName(url)
  link.click()
}

export const DownloadDoc: React.FC<{
  downloadUrl?: () => Promise<string>
  history?: boolean
}> = ({ downloadUrl, history }) => {
  const { classes } = useHoverChildAppear()

  return (
    <Group spacing={4} align='center' className={classes.hover}>
      <Anchor onClick={downloadUrl && (async () => download(await downloadUrl()))}>
        <Group spacing={4} align='center'>
          <FileDownload /> pdf
        </Group>
      </Anchor>
      {history && (
        <Anchor className={classes.appear} onClick={() => {}}>
          (history)
        </Anchor>
      )}
    </Group>
  )
}

export const NoDocs: React.FC = () => {
  return (
    <Stack spacing='xl' my='xl'>
      <Center>
        <Notification
          icon={<FileAlert />}
          title='No Documents found!'
          sx={{ backgroundColor: 'white' }}
          styles={{
            icon: {
              width: 42,
              height: 42,
            },
          }}
          disallowClose
        >
          Upload a document below.
        </Notification>
      </Center>
      <DocDrop />
    </Stack>
  )
}

interface NameEmailProps {
  name?: string
  email?: string
  role?: React.ReactNode
  inactive?: boolean
}

export const NameEmail: React.FC<NameEmailProps> = ({ name, email, role, inactive }) => {
  return (
    <>
      <Group spacing='xs'>
        <Text weight={500} inline color={inactive ? 'inactive' : undefined}>
          {name}
        </Text>
        {role}
      </Group>
      <Text color={inactive ? 'inactive' : 'dimmed'}>{email}</Text>{' '}
    </>
  )
}

export const Status: React.FC<{
  warning: string | boolean | undefined
  inactive?: boolean
}> = ({ warning, inactive }) => {
  if (!warning) {
    return (
      <ActionIcon size={28} color={inactive ? 'inactive' : 'go'}>
        <CircleCheck />
      </ActionIcon>
    )
  }

  return (
    <Tooltip label={warning}>
      <ActionIcon size={28} color={inactive ? 'inactive' : 'urgent'}>
        <AlertOctagon />
      </ActionIcon>
    </Tooltip>
  )
}

export const FullScreenMsg: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <Box my={128}>
      <Text align='center' mb='md' transform='uppercase' color='dimmed'>
        {title}
      </Text>
      <Center>{children}</Center>
    </Box>
  )
}

export const LoadingMsg: React.FC = () => (
  <FullScreenMsg title='Loading Data ...'>
    <Loader />
  </FullScreenMsg>
)

export const MissingRecordMsg: React.FC = () => (
  <FullScreenMsg title='No Record Found'>
    <ActionIcon color='urgent'>
      <AlertOctagon />
    </ActionIcon>
  </FullScreenMsg>
)

export interface IMetadataRowProps {
  metadata?: Metadata
  name: string
  fallback?: React.ReactNode
  valueComponent?: React.ReactNode
}

export * from './hook'
export * from './inline'
