import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  ChevronIcon,
  Group,
  Image,
  Menu,
  Portal,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import React from 'react'
import { AlertOctagon, ChartPie2 } from 'tabler-icons-react'
import { DocType, docTypeStr, ZContentfulMissingDoc, ZDoc } from '../lib/schema'
import { UrgentButton } from './util'

const MiniDocFrame: React.FC<{ icon: React.ReactNode }> = ({ children, icon }) => {
  const theme = useMantineTheme()

  return (
    <UnstyledButton>
      <Group
        align='stretch'
        sx={{
          position: 'relative',
          backgroundColor: 'white',
          overflow: 'clip',
          borderRadius: '4px',
          border: `1px solid ${theme.colors.gray[2]}`,
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: ['0 1px 1px rgba(0, 0, 0, 0.12)', '0 2px 2px rgba(0, 0, 0, 0.12)'],
            transition: 'box-shadow 0.3s ease-in-out',
          },
        }}
        spacing={0}
      >
        {icon}
        <Box sx={{ flex: 'auto' }}>{children}</Box>
      </Group>
    </UnstyledButton>
  )
}

export interface MiniDocProps {
  type: DocType<typeof ZDoc>
  isOutdated?: boolean
}

export const MiniDoc: React.FC<MiniDocProps> = ({ type, isOutdated }) => {
  const imageMargin = 4

  const longName = docTypeStr(type)
  const tooltip = isOutdated ? `Outdated ${longName}` : longName

  return (
    <Tooltip label={tooltip} openDelay={500}>
      <MiniDocFrame
        icon={
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[2],
              flex: 'none',
              overflow: 'hidden',
              position: 'relative',
              width: 40 + imageMargin + imageMargin,
            })}
          >
            <Image
              src='/doc.png'
              alt='document image'
              sx={{
                top: imageMargin,
                left: imageMargin,
                right: imageMargin,
                position: 'absolute',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          </Box>
        }
      >
        <Group spacing={8} p={8}>
          {isOutdated && (
            <ActionIcon size={24} color='urgent'>
              <AlertOctagon />
            </ActionIcon>
          )}
          <Text>
            <Anchor color={isOutdated ? 'urgent' : undefined}>{docTypeStr(type, true)}</Anchor>
          </Text>
        </Group>
      </MiniDocFrame>
    </Tooltip>
  )
}

export const MiniObject: React.FC<{ name: string }> = ({ name }) => {
  return (
    <MiniDocFrame
      icon={
        <Center
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[2],
            flex: 'none',
            width: 48,
          })}
        >
          <ActionIcon>
            <ChartPie2 />
          </ActionIcon>
        </Center>
      }
    >
      <Text p={8}>
        <Anchor>{name} &rsaquo;</Anchor>
      </Text>
    </MiniDocFrame>
  )
}

export const MiniDocWrap: React.FC<{ doc: ZContentfulMissingDoc }> = ({ doc }) => {
  return doc.type === 'MISSING' ? (
    <Tooltip label={`Missing ${docTypeStr(doc.docType)}`}>
      <UrgentButton>Upload Doc</UrgentButton>
    </Tooltip>
  ) : (
    <MiniDoc type={doc.type} />
  )
}

export const MiniDocDisplay: React.FC<{ children: React.ReactNode[] | React.ReactNode }> = ({
  children,
}) => {
  const group = useElementSize()
  const container = useElementSize()

  // The + 20 is a hack that probably closes window prematurely.
  const collapse = container.width < group.width + 20

  return (
    <div ref={container.ref}>
      {collapse ? (
        <>
          <Menu
            control={
              <Button rightIcon={<ChevronIcon />} size='sm'>
                {Array.isArray(children) ? `Documents (${children.length})` : 'Document'}
              </Button>
            }
            size='lg'
            style={{ maxHeight: 160, overflow: 'scroll' }}
          >
            <Stack p='sm' spacing='sm'>
              {children}
            </Stack>
          </Menu>
        </>
      ) : (
        <Group>{children}</Group>
      )}
      {/* Hack: render Group off screen so that we can monitor it's minimal size */}
      <Portal>
        <Group
          noWrap
          ref={group.ref}
          spacing='xs'
          sx={{ visibility: 'hidden', display: 'inline-flex' }}
        >
          {children}
        </Group>
      </Portal>
    </div>
  )
}
