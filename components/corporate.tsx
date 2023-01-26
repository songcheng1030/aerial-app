import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Card,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { NextLink } from '@mantine/next'
import { doc, query } from 'firebase/firestore'
import React from 'react'
import { ArrowsDiagonal, Clipboard, ClipboardCheck } from 'tabler-icons-react'
import { cruds } from '../lib/crud'
import { ZContentfulDoc } from '../lib/schema'
import { DocGroup, equityData, primaryDocs } from '../lib/state'
import { DocGroupComp, MissingDocComp } from './doc'
import { MetadataRow } from './metadata'
import { MiniDoc, MiniDocDisplay } from './minidoc'
import {
  ClickableTooltip,
  InlineDateInput,
  LoadingMsg,
  MissingRecordMsg,
  useHoverChildAppear,
} from './util'

const CopyableContent: React.FC = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <Group spacing={4} align='flex-start'>
      <Box>
        <ClickableTooltip label='Copy to clipboard' clickedLabel='Copied!'>
          {({ clicked }) => (
            <UnstyledButton
              sx={(theme) => ({
                color: theme.colors.primary[5],
                '&:hover': {
                  color: theme.colors.primary[3],
                },
              })}
              onClick={() => navigator.clipboard.writeText(ref.current?.innerText ?? '')}
            >
              {clicked ? <ClipboardCheck /> : <Clipboard />}
            </UnstyledButton>
          )}
        </ClickableTooltip>
      </Box>
      <Box ref={ref}>{children}</Box>
    </Group>
  )
}

const Row: React.FC<{ name: string; value: React.ReactNode }> = ({ name, value, children }) => {
  return (
    <tr>
      <td>
        <Text>{name}</Text>
      </td>
      <td>
        <CopyableContent>{value}</CopyableContent>
      </td>
      <td>{children}</td>
    </tr>
  )
}

const InfoTable: React.FC = ({ children }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th />
          <th>Information</th>
          <th>Source Document</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

interface TableCardProps {
  title: string
}

const TableCard: React.FC<TableCardProps> = ({ title, children }) => {
  return (
    <Card shadow='lg' sx={(theme) => ({ border: `1px solid ${theme.colors.gray[2]}` })}>
      <Title order={3}>{title}</Title>
      {children}
    </Card>
  )
}

export const Summary: React.FC = () => {
  return (
    <Box mx='auto' my='lg'>
      <Group spacing='md'>
        <TableCard title='Corporate Information'>
          <InfoTable>
            <Row name='Formal Company Name' value='Seed, Inc.'>
              <MiniDoc type='ARTICLES_OF_INCORPORATION' />
            </Row>
            <Row name='Founding Date' value='Feb 5, 2020'>
              <MiniDoc type='ARTICLES_OF_INCORPORATION' />
            </Row>
            <Row
              name='Company Address'
              value={
                <>
                  107 Belmont Ave E<br />
                  Seattle, WA 98102.
                </>
              }
            />
            <Row name='Employer ID Number' value='89-1234567'>
              <MiniDoc type='IRS_EIN_ASSIGNMENT_LETTER' />
            </Row>
          </InfoTable>
        </TableCard>
        <TableCard title='Cap Table Information'>
          <InfoTable>
            <Row
              name='Authorized Shares'
              value={`$${equityData.authorizedShares.toLocaleString()}`}
            >
              <MiniDoc type='ARTICLES_OF_INCORPORATION' />
            </Row>
            <Row name='Preferred Shares' value={`$${equityData.preferredShares.toLocaleString()}`}>
              <Anchor href='equity'>Equity</Anchor>
            </Row>
            <Row name='Common Shares' value={`$${equityData.commonShares.toLocaleString()}`}>
              <Anchor href='equity'>Equity</Anchor>
            </Row>
            <Row name='Option Pool' value={`$${equityData.optionPool.toLocaleString()}`}>
              <MiniDoc type='STOCK_OPTION_PLAN' />
            </Row>
            <Row
              name='Fully-Diluted Shares'
              value={`$${equityData.fullyDiluted.toLocaleString()}`}
            />
          </InfoTable>
        </TableCard>
      </Group>
    </Box>
  )
}

export const PrimaryDocuments: React.FC = () => {
  return (
    <Stack spacing='xl' py='xl'>
      <MissingDocComp type='CORPORATE_BYLAWS' />
      {DocGroup.toDocGroups(primaryDocs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

const StateRow: React.FC<{ jurisdiction: string; docGroups: DocGroup[]; href: string }> = ({
  jurisdiction,
  docGroups,
  href,
}) => {
  const isCurrent = docGroups.every((dg) => dg.isCurrent)
  const { classes } = useHoverChildAppear()

  return (
    <tr className={classes.hover}>
      <td>{jurisdiction}</td>
      <td>{isCurrent ? <Badge>Current</Badge> : <Badge color='urgent'>Outdated</Badge>}</td>
      <td>
        <MiniDocDisplay>
          {docGroups.map((docGroup, key) => (
            <MiniDoc
              type={docGroup.latest.type as ZContentfulDoc['type']}
              isOutdated={!docGroup.isCurrent}
              key={key}
            />
          ))}
        </MiniDocDisplay>
      </td>
      <td className={classes.appear}>
        <ActionIcon component={NextLink} ml='auto' href={href}>
          <ArrowsDiagonal />
        </ActionIcon>
      </td>
    </tr>
  )
}

export const StateLocalComp: React.FC = () => {
  const stateSnap = cruds.state.useQuerySnapshot(query(cruds.state.collection))
  const localSnap = cruds.local.useQuerySnapshot(query(cruds.local.collection))

  if (stateSnap.isLoading || localSnap.isLoading) {
    return <LoadingMsg />
  }
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Jurisdiction</th>
          <th>Status</th>
          <th>Document</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {stateSnap.snap?.docs.map(({ data, id }) => {
          if (!data) return null
          return (
            <StateRow
              jurisdiction={data.state}
              key={id}
              href={`/state/${id}`}
              docGroups={DocGroup.toDocGroups(data.docs)}
            />
          )
        })}
        {localSnap.snap?.docs.map(({ data, id }) => {
          if (!data) return null
          return (
            <StateRow
              jurisdiction={data.jurisdiction}
              key={id}
              href={`/local/${id}`}
              docGroups={DocGroup.toDocGroups(data.docs)}
            />
          )
        })}
      </tbody>
    </Table>
  )
}

export const StateDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.state.useDocumentSnapshot(doc(cruds.state.collection, id))
  const data = snap?.data
  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>State</td>
            <td>{data.state}</td>
            <td />
          </tr>
          <MetadataRow
            name='Start Date'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.state.update(id, { startDate: value })}
              />
            }
          />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(data.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const LocalDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.local.useDocumentSnapshot(doc(cruds.local.collection, id))
  const data = snap?.data
  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>Jurisdiction</td>
            <td>{data.jurisdiction}</td>
            <tr />
          </tr>
          <MetadataRow
            name='Start Date'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.local.update(id, { startDate: value })}
              />
            }
          />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(data.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}
