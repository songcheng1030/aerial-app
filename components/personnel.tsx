import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Loader,
  Stack,
  Table,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { NextLink } from '@mantine/next'
import { doc, query } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'
import { ArrowsDiagonal } from 'tabler-icons-react'
import { cruds } from '../lib/crud'
import { MetadataDate } from '../lib/schema'
import { Party } from '../lib/schema/party'
import { DocGroup } from '../lib/state'
import { DocGroupComp } from './doc'
import { MetadataRow } from './metadata'
import { MiniDocDisplay, MiniDocWrap } from './minidoc'
import { FullScreenMsg, LoadingMsg, NameEmail, Status, useHoverChildAppear } from './util'

const AddEmployee: React.FC = () => (
  <Link href='/newEmployee' passHref>
    <Button component='a' size='sm'>
      Add
    </Button>
  </Link>
)

export const EmployeeComp = () => {
  const { snap, isLoading } = cruds.employee.useQuerySnapshot(query(cruds.employee.collection))
  const { classes } = useHoverChildAppear()

  if (isLoading) {
    return <LoadingMsg />
  }

  const employees = snap?.docs ?? []

  const rows = employees.map(({ data: employee, id }) => {
    if (!employee) return null
    return (
      <tr key={id} className={classes.hover}>
        <td style={{ paddingRight: 0 }}>
          <Status warning={!employee.isComplete && 'Missing Document'} />
        </td>
        <td>
          <NameEmail {...employee.party} />
        </td>
        <td>{employee.startDate?.string}</td>
        <td>{employee.salary?.string}</td>
        <td>
          <MiniDocDisplay>
            <MiniDocWrap doc={employee.offer} />
            <MiniDocWrap doc={employee.employment} />
            <MiniDocWrap doc={employee.assignment} />
          </MiniDocDisplay>
        </td>
        <td className={classes.appear}>
          <ActionIcon component={NextLink} ml='auto' href={`/employee/${id}`}>
            <ArrowsDiagonal />
          </ActionIcon>
        </td>
      </tr>
    )
  })

  return (
    <Box sx={{ maxWidth: 1200 }} mr='auto'>
      <Table striped>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Start Date</th>
            <th>Salary</th>
            <th>Documents</th>
            <th style={{ paddingRight: 0 }}>
              <AddEmployee />
            </th>
          </tr>
        </thead>

        {employees.length === 0 && (
          <FullScreenMsg title='No employee data'>
            <AddEmployee />
          </FullScreenMsg>
        )}

        {employees.length > 0 && <tbody>{rows}</tbody>}
      </Table>
    </Box>
  )
}

const NonEmployeeTable: React.FC = ({ children }) => {
  return (
    <Box sx={{ maxWidth: 1200 }} mr='auto'>
      <Table striped>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Role</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Documents</th>
            <th style={{ paddingRight: 0 }}>
              <Button component='a' size='sm'>
                Add
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </Box>
  )
}
interface RelationBase {
  startDate?: MetadataDate
  endDate?: MetadataDate
  party?: Party
  isComplete: boolean
}

interface NonEmployeeRowProp {
  person?: RelationBase
  id: string
  title: string
  href: string
}

const NonEmployeeRow: React.FC<NonEmployeeRowProp> = ({ person, children, id, title, href }) => {
  const theme = useMantineTheme()
  const { classes } = useHoverChildAppear()
  if (!person) return null
  const inactive = !!person.endDate

  return (
    <tr
      key={id}
      className={classes.hover}
      style={{
        color: inactive ? theme.colors.gray[5] : 'inherit',
      }}
    >
      <td style={{ paddingRight: 0 }}>
        <Status warning={!person.isComplete && 'Missing Document'} inactive={inactive} />
      </td>
      <td>
        <NameEmail {...person.party} inactive={inactive} />
      </td>
      <td>
        <Badge color={inactive ? 'inactive' : undefined}>{title}</Badge>
      </td>
      <td>{person.startDate?.string}</td>
      <td>{person.endDate?.string ?? <Badge>Current</Badge>}</td>
      <td>{children}</td>
      <td className={classes.appear}>
        <ActionIcon component={NextLink} ml='auto' href={href}>
          <ArrowsDiagonal />
        </ActionIcon>
      </td>
    </tr>
  )
}

export const OfficerComp: React.FC = () => {
  const { snap, isLoading } = cruds.officer.useQuerySnapshot(query(cruds.officer.collection))

  if (isLoading) {
    return <LoadingMsg />
  }

  return (
    <NonEmployeeTable>
      {(snap?.docs ?? []).map(({ data: person, id }) => (
        <NonEmployeeRow person={person} id={id} title='Officer' href={`/officer/${id}`}>
          {person && (
            <MiniDocDisplay>
              <MiniDocWrap doc={person.consent} />
              <MiniDocWrap doc={person.indemnification} />
            </MiniDocDisplay>
          )}
        </NonEmployeeRow>
      ))}
    </NonEmployeeTable>
  )
}

export const DirectorComp: React.FC = () => {
  const { snap, isLoading } = cruds.director.useQuerySnapshot(query(cruds.director.collection))

  if (isLoading) {
    return <LoadingMsg />
  }

  return (
    <NonEmployeeTable>
      {(snap?.docs ?? []).map(({ data: person, id }) => (
        <NonEmployeeRow person={person} id={id} title='Director' href={`/director/${id}`}>
          {person && (
            <MiniDocDisplay>
              <MiniDocWrap doc={person.consent} />
              <MiniDocWrap doc={person.indemnification} />
            </MiniDocDisplay>
          )}
        </NonEmployeeRow>
      ))}
    </NonEmployeeTable>
  )
}

export const ContractorComp: React.FC = () => {
  const { snap, isLoading } = cruds.contractor.useQuerySnapshot(query(cruds.contractor.collection))

  if (isLoading) {
    return <LoadingMsg />
  }

  return (
    <NonEmployeeTable>
      {(snap?.docs ?? []).map(({ data: person, id }) => (
        <NonEmployeeRow person={person} id={id} title='Contractor' href={`/contractor/${id}`}>
          {person && (
            <MiniDocDisplay>
              <MiniDocWrap doc={person.agreement} />
            </MiniDocDisplay>
          )}
        </NonEmployeeRow>
      ))}
    </NonEmployeeTable>
  )
}

export const AdvisorComp: React.FC = () => {
  const { snap, isLoading } = cruds.advisor.useQuerySnapshot(query(cruds.advisor.collection))

  if (isLoading) {
    return <LoadingMsg />
  }

  return (
    <NonEmployeeTable>
      {(snap?.docs ?? []).map(({ data: person, id }) => (
        <NonEmployeeRow person={person} id={id} title='Advisor' href={`/advisor/${id}`}>
          {person && (
            <MiniDocDisplay>
              <MiniDocWrap doc={person.agreement} />
              <MiniDocWrap doc={person.consent} />
            </MiniDocDisplay>
          )}
        </NonEmployeeRow>
      ))}
    </NonEmployeeTable>
  )
}

export const EmployeeDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.employee.useDocumentSnapshot(doc(cruds.employee.collection, id))
  const employee = snap?.data
  if (!employee) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={employee.startDate} />
          <MetadataRow name='End Date' metadata={employee.endDate} />
          <MetadataRow name='Salary' metadata={employee.salary} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(employee.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const OfficerDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.officer.useDocumentSnapshot(doc(cruds.officer.collection, id))
  const officer = snap?.data
  if (!officer) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={officer.startDate} />
          <MetadataRow name='End Date' metadata={officer.endDate} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(officer.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const DirectorDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.director.useDocumentSnapshot(doc(cruds.director.collection, id))
  const director = snap?.data
  if (!director) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={director.startDate} />
          <MetadataRow name='End Date' metadata={director.endDate} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(director.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const AdvisorDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.advisor.useDocumentSnapshot(doc(cruds.advisor.collection, id))
  const advisor = snap?.data
  if (!advisor) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={advisor.startDate} />
          <MetadataRow name='End Date' metadata={advisor.endDate} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(advisor.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const ContractorDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.contractor.useDocumentSnapshot(doc(cruds.contractor.collection, id))
  const contractor = snap?.data
  if (!contractor) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={contractor.startDate} />
          <MetadataRow name='End Date' metadata={contractor.endDate} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(contractor.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}
