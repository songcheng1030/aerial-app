import {
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Image,
  Stack,
  Sx,
  Text,
  UnstyledButton,
} from '@mantine/core'
import React from 'react'
import { ChevronDown } from 'tabler-icons-react'
import { createContainer } from 'unstated-next'
import { DocType, docTypeStr, ZContentfulDoc, ZDoc } from '../lib/schema'
import { Doc, DocGroup, DocQuery } from '../lib/state'
import { Detail } from './detail'
import { NoDocs, UrgentButton } from './util'

const expandDuration = 500

const UrgentBadge: React.FC = ({ children }) => {
  return <Badge color='urgent'>{children}</Badge>
}

const PrimaryBadge: React.FC = ({ children }) => {
  return <Badge color='primary'>{children}</Badge>
}

type DocMetadata = {
  isLatest: boolean
  groupSize?: number
}

const docFrameDimensions = {
  imageMargin: 16,
  imageWidth: 200,
  minHeight: 150,
  borderRadius: 16,
}

const DocFrameRaw: React.FC<{
  imageSrc?: string
}> = ({ imageSrc, children }) => {
  return (
    <Group
      align='stretch'
      sx={({ other, colors }) => ({
        position: 'relative',
        width: other.widths.md,
        overflow: 'clip',
        borderRadius: docFrameDimensions.borderRadius,
        border: `1px solid ${colors.gray[2]}`,
        transition: 'box-shadow 0.3s ease-in-out',
        boxShadow: [
          '0 1px 1px rgba(0, 0, 0, 0.12)',
          '0 2px 2px rgba(0, 0, 0, 0.12)',
          '0 4px 4px rgba(0, 0, 0, 0.12)',
        ],
        '&:hover': {
          boxShadow: [
            '0 1px 1px rgba(0, 0, 0, 0.12)',
            '0 2px 2px rgba(0, 0, 0, 0.12)',
            '0 4px 4px rgba(0, 0, 0, 0.12)',
            '0 8px 8px rgba(0, 0, 0, 0.12)',
          ],
        },
        backgroundColor: 'white',
      })}
      spacing={0}
    >
      <UnstyledButton
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[2],
          flex: 'none',
          overflow: 'hidden',
          position: 'relative',
          width: docFrameDimensions.imageWidth + 2 * docFrameDimensions.imageMargin,
          minHeight: docFrameDimensions.minHeight + docFrameDimensions.imageMargin,
        })}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt='document image'
            sx={{
              top: docFrameDimensions.imageMargin,
              left: docFrameDimensions.imageMargin,
              right: docFrameDimensions.imageMargin,
              position: 'absolute',
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        ) : null}
      </UnstyledButton>
      <Box sx={{ flex: 'auto' }}>{children}</Box>
    </Group>
  )
}
const DocFrame = Object.assign(DocFrameRaw, docFrameDimensions)

const ExpandedState = createContainer(() => {
  const [expanded, setExpanded] = React.useState(false)
  return { expanded, setExpanded }
})

const GroupSizeButton: React.FC<{ meta: DocMetadata }> = ({ meta }) => {
  const { expanded, setExpanded } = ExpandedState.useContainer()

  if (!meta.groupSize) return null
  if (!meta.isLatest) return null
  if (meta.groupSize === 1) return <Text color='dimmed'>1 doc</Text>

  return (
    <Text>
      <Anchor onClick={() => setExpanded((expanded_) => !expanded_)}>
        <Group spacing={2}>
          {meta.groupSize} docs
          <ChevronDown
            style={{
              transition: `all ${expandDuration}ms ease-in-out`,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            }}
          />
        </Group>
      </Anchor>
    </Text>
  )
}

const ContentfulDoc: React.FC<{
  doc: ZContentfulDoc
  meta: DocMetadata
}> = ({ doc, meta }) => {
  const state = Doc.docState(doc, meta.isLatest)
  const { open } = Detail.useState()
  const { type, party, startDate, endDate, properties = [] } = doc

  const textColor: Sx = (theme) => ({
    color: state === 'inactive' ? theme.colors.gray[6] : 'inherit',
  })

  return (
    <Stack
      spacing='xs'
      sx={{
        flex: 'auto',
      }}
      p='16px'
    >
      <Group position='apart' align='flex-start'>
        <Stack spacing='xs'>
          <Text sx={textColor}>
            <b>{docTypeStr(type)}</b>
          </Text>
          {party && <Text sx={textColor}>{party.name}</Text>}
          <Text sx={textColor}>
            Term: <b>{startDate.toLocaleDateString()}</b> to{' '}
            {endDate ? <b>{endDate.toLocaleDateString()}</b> : 'present'}
          </Text>
          {properties.map(({ key, value }) => (
            <Text sx={textColor} key={key}>
              {key}: <b>{value}</b>
            </Text>
          ))}
        </Stack>
        <Stack spacing='xs' sx={{ flex: 'none' }} align='flex-end'>
          {state === 'active' ? (
            <PrimaryBadge>Active</PrimaryBadge>
          ) : state === 'inactive' ? (
            <Badge color='gray'>Inactive</Badge>
          ) : (
            <UrgentBadge>Outdated</UrgentBadge>
          )}
          <GroupSizeButton meta={meta} />
        </Stack>
      </Group>
      {state === 'outdated' && (
        <Center>
          <Group>
            <Button color='gray' variant='subtle'>
              Inactive
            </Button>
            <UrgentButton onClick={open}>Update</UrgentButton>
          </Group>
        </Center>
      )}
    </Stack>
  )
}

const UncategorizedDoc: React.FC = () => {
  const { setUrl } = Detail.useState()

  return (
    <Stack sx={{ padding: '16px', height: '100%' }} align='stretch'>
      <Group position='apart' sx={{ flex: 'none' }}>
        <Text>
          <b>Uncategorized Doc</b>
        </Text>
        <UrgentBadge>Uncategorized</UrgentBadge>
      </Group>
      <Center sx={{ flex: 'auto' }}>
        <Group>
          <Button color='gray' variant='subtle'>
            Dismiss
          </Button>
          <UrgentButton
            onClick={() => {
              setUrl('/sample-contract.pdf')
            }}
          >
            Categorize
          </UrgentButton>
        </Group>
      </Center>
    </Stack>
  )
}

const ProcessingDoc: React.FC = () => {
  const { setUrl } = Detail.useState()

  return (
    <Stack sx={{ padding: '16px', height: '100%' }} align='stretch'>
      <Group position='apart' sx={{ flex: 'none' }}>
        <Text>
          <b>Processing</b>
        </Text>
        <PrimaryBadge>Processing</PrimaryBadge>
      </Group>
      <Center sx={{ flex: 'auto' }}>
        <Group>
          <Button color='gray' variant='subtle'>
            Dismiss
          </Button>
          <UrgentButton
            onClick={() => {
              setUrl('/sample-contract.pdf')
            }}
          >
            Categorize
          </UrgentButton>
        </Group>
      </Center>
    </Stack>
  )
}

const DocComp: React.FC<{
  doc: ZDoc
  meta: DocMetadata
}> = ({ doc, meta }) => {
  switch (doc.type) {
    case 'UNCATEGORIZED':
      return (
        <DocFrame imageSrc='/doc.png'>
          <UncategorizedDoc />
        </DocFrame>
      )
    case 'PROCESSING':
      return (
        <DocFrame imageSrc='/doc.png'>
          <ProcessingDoc />
        </DocFrame>
      )
    case 'DISMISSED':
      return null
  }
  return (
    <DocFrame imageSrc='/doc.png'>
      <ContentfulDoc doc={doc} meta={meta} />
    </DocFrame>
  )
}

/**
 * children layout is bottom to top so that top document automatically
 * has the highest 'z-index'
 */
const ReverseColumn: React.FC = ({ children }) => {
  return <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>{children}</div>
}

const DocGroupRawComp: React.FC<{ docGroup: DocGroup }> = ({ docGroup }) => {
  const { expanded } = ExpandedState.useContainer()

  return (
    <ReverseColumn>
      <Collapse in={expanded} transitionDuration={expandDuration}>
        <ReverseColumn>
          {docGroup.previous.map((doc, key) => (
            <DocComp doc={doc} meta={{ isLatest: false }} key={key} />
          ))}
        </ReverseColumn>
      </Collapse>
      <DocComp doc={docGroup.latest} meta={{ groupSize: docGroup.docs.length, isLatest: true }} />
    </ReverseColumn>
  )
}
export const DocGroupComp: React.FC<{ docGroup: DocGroup }> = ({ docGroup }) => {
  return (
    <ExpandedState.Provider>
      <DocGroupRawComp docGroup={docGroup} />
    </ExpandedState.Provider>
  )
}

export interface MissingDocProp {
  type: DocType<typeof ZContentfulDoc>
}

export const MissingDocComp: React.FC<MissingDocProp> = ({ type }) => {
  const { open } = Detail.useState()

  return (
    <DocFrame>
      <Stack sx={{ padding: '16px', height: '100%' }} align='stretch'>
        <Group position='apart'>
          <Text>
            <b>{docTypeStr(type)}</b>
          </Text>
          <UrgentBadge>Missing</UrgentBadge>
        </Group>
        <Center sx={{ flex: 'auto' }}>
          <UrgentButton onClick={open}>Upload</UrgentButton>
        </Center>
      </Stack>
    </DocFrame>
  )
}

/**
 * Simple Doc View
 */
interface DocViewProps {
  query: DocQuery
}

export const DocView: React.FC<DocViewProps> = ({ query }) => {
  const docGroups = DocGroup.query(query)

  if (docGroups.length === 0) {
    return <NoDocs />
  }

  return (
    <Stack spacing='xl' py='xl'>
      {docGroups.map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}
