import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { NextLink } from '@mantine/next'
import { doc, query } from 'firebase/firestore'
import React from 'react'
import { ArrowsDiagonal } from 'tabler-icons-react'
import { cruds } from '../lib/crud'
import { extractEquityData, Shareholder } from '../lib/equity'
import { DocGroup } from '../lib/state'
import { formattedNumber } from '../lib/util'
import { DocGroupComp } from './doc'
import { MetadataRow } from './metadata'
import { MiniDocDisplay, MiniDocWrap, MiniObject } from './minidoc'
import {
  FullScreenMsg,
  InlineDateInput,
  InlineNumberInput,
  InlinePriceInput,
  LoadingMsg,
  MissingRecordMsg,
  NameEmail,
  Status,
  useHoverChildAppear,
} from './util'

const AddInvestor = () => <Button size='sm'>Add</Button>

const AddEquity: React.FC = () => (
  <Button component='a' size='sm'>
    Add
  </Button>
)

const InvestmentDocs: React.FC<{ shareholder: Shareholder }> = ({ shareholder }) => {
  switch (shareholder.type) {
    case 'Common':
      return (
        <MiniDocDisplay>
          <MiniDocWrap doc={shareholder.data.purchase!} />
          <MiniDocWrap doc={shareholder.data._83b!} />
          <MiniDocWrap doc={shareholder.data.consent!} />
        </MiniDocDisplay>
      )
    case 'SAFE':
      return (
        <MiniDocDisplay>
          <MiniDocWrap doc={shareholder.data.grant!} />
          <MiniDocWrap doc={shareholder.data.consent!} />
        </MiniDocDisplay>
      )
    case 'Option':
      return (
        <MiniDocDisplay>
          <MiniDocWrap doc={shareholder.data.grant!} />
          <MiniDocWrap doc={shareholder.data.consent!} />
        </MiniDocDisplay>
      )
    case 'Preferred': // no docs here
      return (
        <Group spacing='md'>
          <MiniObject name='Seed Round' />
        </Group>
      )
    default:
      throw Error(`Unexpected Shareholder type ${shareholder.type}`)
  }
}

const NA: React.FC = () => {
  const theme = useMantineTheme()

  return (
    <Text color={theme.colors.gray[5]} align='right'>
      &mdash;&nbsp;&nbsp;&nbsp;&nbsp;
    </Text>
  )
}

const toPercent = (x: number) => `${(100 * x).toFixed(2)}%`

export const CapTableComp = () => {
  const safeSnap = cruds.safe.useQuerySnapshot(query(cruds.safe.collection))
  const preferredSnap = cruds.preferred.useQuerySnapshot(query(cruds.preferred.collection))
  const optionSnap = cruds.option.useQuerySnapshot(query(cruds.option.collection))
  const commonSnap = cruds.common.useQuerySnapshot(query(cruds.common.collection))

  const { classes } = useHoverChildAppear()

  if (
    safeSnap.isLoading ||
    preferredSnap.isLoading ||
    optionSnap.isLoading ||
    commonSnap.isLoading
  ) {
    return <LoadingMsg />
  }

  const shareholders = [
    ...(safeSnap.snap?.docs ?? []).map((s) => ({ ...s, type: 'SAFE' })),
    ...(preferredSnap.snap?.docs ?? []).map((s) => ({ ...s, type: 'Preferred' })),
    ...(optionSnap.snap?.docs ?? []).map((s) => ({ ...s, type: 'Option' })),
    ...(commonSnap.snap?.docs ?? []).map((s) => ({ ...s, type: 'Common' })),
  ].sort(
    (x, y) => x.data!.startDate!.value.getTime() - y.data!.startDate!.value.getTime()
  ) as Shareholder[]

  const equityData = extractEquityData(shareholders)

  const rows = shareholders.map((s) => (
    <tr key={s.id} className={classes.hover}>
      <td style={{ paddingRight: 0 }}>
        <Status
          warning={s.data._83b?.type === 'MISSING' && 'Missing Section 83(B) Election Form'}
        />
      </td>
      <td>
        <NameEmail {...s.data.party} />
      </td>
      <td>
        <Badge>{s.type}</Badge>
      </td>
      <td>
        <Text align='right'>{s.data.startDate?.string}</Text>
      </td>
      <td>
        <Text align='right'>{s.data.shares?.string ?? <NA />}</Text>
      </td>
      <td>{s.data.investment ? <Text align='right'>{s.data.investment.string}</Text> : <NA />}</td>
      <td>
        {s.data.shares ? (
          <Text align='right'>{toPercent(s.data.shares.value / equityData.fullyDiluted)}</Text>
        ) : (
          <NA />
        )}
      </td>
      <td>
        <InvestmentDocs shareholder={s} />
      </td>
      <td className={classes.appear}>
        <ActionIcon ml='auto' component={NextLink} href={`${s.type.toLowerCase()}/${s.id}`}>
          <ArrowsDiagonal />
        </ActionIcon>
      </td>
    </tr>
  ))

  const optionPoolRow = (
    <tr>
      <td />
      <td>
        <Text weight={500}>Remaining Option Pool</Text>
      </td>
      <td>
        <Badge>Pool</Badge>
      </td>
      <td />
      <td>
        <Text align='right'>{equityData.optionRemaining.toLocaleString()}</Text>
      </td>
      <td />
      <td>
        <Text align='right'>{toPercent(equityData.optionRemaining / equityData.fullyDiluted)}</Text>
      </td>
      <td />
      <td />
    </tr>
  )

  const sumRow = (
    <tr>
      <th />
      <th>Fully Diluted Total</th>
      <th />

      <th />
      <th>
        <Text align='right'>
          {(equityData.totalShares + equityData.optionRemaining).toLocaleString()}
        </Text>
      </th>
      <th>
        <Text align='right'>${formattedNumber(equityData.totalFunding, 2)}</Text>
      </th>
      <th>
        <Text align='right'>
          {toPercent(
            (equityData.totalShares + equityData.optionRemaining) / equityData.fullyDiluted
          )}
        </Text>
      </th>
      <th />
      <th />
    </tr>
  )

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th />
            <th>Equity Holder</th>
            <th>Class</th>
            <th>
              <Text align='right'>Issued</Text>
            </th>
            <th>
              <Text align='right'>Shares</Text>
            </th>
            <th>
              <Text align='right'>Investment</Text>
            </th>
            <th>
              <Tooltip label='Ownership percentage of fully diluted'>
                <Text align='right'>Ownership</Text>
              </Tooltip>
            </th>
            <th>Documents</th>
            <th style={{ paddingRight: 0 }}>
              <AddInvestor />
            </th>
          </tr>
        </thead>
        {shareholders.length > 0 && (
          <>
            <tbody>
              {rows}
              {optionPoolRow}
            </tbody>
            <tfoot>{sumRow}</tfoot>
          </>
        )}
      </Table>
      {shareholders.length === 0 && (
        <Box my={128}>
          <Text align='center' mb='md' transform='uppercase' color='dimmed'>
            No cap table data
          </Text>
          <Center>
            <AddInvestor />
          </Center>
        </Box>
      )}
    </>
  )
}

export const SafeDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.safe.useDocumentSnapshot(doc(cruds.safe.collection, id))

  const data = snap?.data

  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>Equity Holder</td>
            <td>
              <NameEmail {...data.party} />
            </td>
            <td />
          </tr>
          <MetadataRow
            name='Issued'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.safe.update(id, { startDate: value })}
              />
            }
          />
          <MetadataRow
            name='Investment'
            metadata={data.investment}
            inlineEdit={
              <InlinePriceInput
                initialValue={data.investment}
                update={(value) => cruds.safe.update(id, { investment: value })}
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

export const PreferredDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.preferred.useDocumentSnapshot(
    doc(cruds.preferred.collection, id)
  )

  const data = snap?.data

  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>Equity Holder</td>
            <td>
              <NameEmail {...data.party} />
            </td>
            <td />
          </tr>
          <MetadataRow
            name='Issued'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.preferred.update(id, { startDate: value })}
              />
            }
          />
          <MetadataRow
            name='Shares'
            metadata={data.shares}
            inlineEdit={
              <InlineNumberInput
                initialValue={data.shares}
                update={(value) => cruds.preferred.update(id, { shares: value })}
              />
            }
          />
          <MetadataRow
            name='Investment'
            metadata={data.investment}
            inlineEdit={
              <InlinePriceInput
                initialValue={data.investment}
                update={(value) => cruds.preferred.update(id, { investment: value })}
              />
            }
          />
        </tbody>
      </Table>
      <Table />
    </Stack>
  )
}
export const OptionDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.option.useDocumentSnapshot(doc(cruds.option.collection, id))

  const data = snap?.data

  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>Equity Holder</td>
            <td>
              <NameEmail {...data.party} />
            </td>
            <td />
          </tr>
          <MetadataRow
            name='Issued'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.option.update(id, { startDate: value })}
              />
            }
          />
          <MetadataRow
            name='Investment'
            metadata={data.shares}
            inlineEdit={
              <InlinePriceInput
                initialValue={data.shares}
                update={(value) => cruds.option.update(id, { shares: value })}
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
export const CommonDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap, isLoading } = cruds.common.useDocumentSnapshot(doc(cruds.common.collection, id))

  const data = snap?.data

  if (isLoading) return <Loader />
  if (!data) return <MissingRecordMsg />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <tr>
            <td>Equity Holder</td>
            <td>
              <NameEmail {...data.party} />
            </td>
            <td />
          </tr>
          <MetadataRow
            name='Issued'
            metadata={data.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={data.startDate}
                update={(value) => cruds.common.update(id, { startDate: value })}
              />
            }
          />

          <MetadataRow
            name='Shares'
            metadata={data.shares}
            inlineEdit={
              <InlineNumberInput
                initialValue={data.shares}
                update={(value) => cruds.common.update(id, { shares: value })}
              />
            }
          />
          <MetadataRow
            name='Investment'
            metadata={data.investment}
            inlineEdit={
              <InlinePriceInput
                initialValue={data.investment}
                update={(value) => cruds.common.update(id, { investment: value })}
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

export const ValuationComp: React.FC = () => {
  const { snap, isLoading } = cruds.valuation.useQuerySnapshot(query(cruds.valuation.collection))
  const { classes } = useHoverChildAppear()

  if (isLoading) {
    return <LoadingMsg />
  }

  const valuations = snap?.docs ?? []

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Start</th>
          <th>End</th>
          <th>
            <Text align='right'>Valuation</Text>
          </th>
          <th>Documents</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {valuations.map(({ data: valuation, id }) => {
          if (!valuation) return null

          const price = valuation.valuation?.value

          return (
            <tr key={id} className={classes.hover}>
              <td>Valuation</td>
              <td>
                {valuation.isCurrent ? (
                  <Badge>Current</Badge>
                ) : (
                  <Badge color='inactive'>Inactive</Badge>
                )}
              </td>
              <td>{valuation.startDate?.string}</td>
              <td>{valuation.endDate?.string}</td>
              <td>
                <Text align='right'>${price}</Text>
              </td>
              <td>
                <MiniDocDisplay>
                  <MiniDocWrap doc={valuation._409a} />
                  <MiniDocWrap doc={valuation.boardConsent} />
                </MiniDocDisplay>
              </td>
              <td className={classes.appear}>
                <ActionIcon component={NextLink} ml='auto' href={`/valuation/${id}`}>
                  <ArrowsDiagonal />
                </ActionIcon>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export const ValuationDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.valuation.useDocumentSnapshot(doc(cruds.valuation.collection, id))

  const valuation = snap?.data

  if (!valuation) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow
            name='Start Date'
            metadata={valuation.startDate}
            inlineEdit={
              <InlineDateInput
                initialValue={valuation.startDate}
                update={(value) => cruds.valuation.update(id, { startDate: value })}
              />
            }
          />
          {/* This one is not editable */}
          <MetadataRow name='End Date' metadata={valuation.endDate} />
          <MetadataRow
            name='Valuation'
            metadata={valuation.valuation}
            inlineEdit={
              <InlinePriceInput
                initialValue={valuation.valuation}
                update={(value) => cruds.valuation.update(id, { valuation: value })}
              />
            }
          />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(valuation.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const StockOptionPlanComp = () => {
  const { snap, isLoading } = cruds.optionPlan.useQuerySnapshot(query(cruds.optionPlan.collection))
  const { classes } = useHoverChildAppear()

  if (isLoading) {
    return <LoadingMsg />
  }

  const equityType = snap?.docs ?? []

  const rows = equityType.map(({ data: equity, id }) => {
    if (!equity) return null
    return (
      <tr key={id} className={classes.hover}>
        <td style={{ paddingRight: 0 }}>
          <Status warning={!equity.isComplete && 'Missing Document'} />
        </td>
        <td>
          {/* {equity.party.name.string} */}
          <NameEmail {...equity.party} />
        </td>
        <td>{equity.startDate?.string}</td>
        <td>{equity.endDate?.string}</td>
        <td>
          <MiniDocDisplay>
            <MiniDocWrap doc={equity.plan} />
            <MiniDocWrap doc={equity.boardConsent} />
          </MiniDocDisplay>
        </td>
        <td className={classes.appear}>
          <ActionIcon component={NextLink} ml='auto' href={`/optionplan/${id}`}>
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
            <th>Start</th>
            <th>End</th>
            <th>Documents</th>
          </tr>
        </thead>

        {equityType.length === 0 && (
          <FullScreenMsg title='No employee data'>
            <AddEquity />
          </FullScreenMsg>
        )}

        {equityType.length > 0 && <tbody>{rows}</tbody>}
      </Table>
    </Box>
  )
}

export const FundraisingComp = () => {
  const { snap, isLoading } = cruds.fundraising.useQuerySnapshot(
    query(cruds.fundraising.collection)
  )
  const { classes } = useHoverChildAppear()

  if (isLoading) {
    return <LoadingMsg />
  }

  const fundraisings = snap?.docs ?? []

  const rows = fundraisings.map(({ data: fundraising, id }) => {
    if (!fundraising) return null
    return (
      <tr key={id} className={classes.hover}>
        <td style={{ paddingRight: 0 }}>
          <Status warning={!fundraising.isComplete && 'Missing Document'} />
        </td>
        <td>{fundraising.fundraisingRound}</td>
        <td>{fundraising.startDate?.string}</td>
        <td>
          <MiniDocDisplay>
            <MiniDocWrap doc={fundraising.voting} />
            <MiniDocWrap doc={fundraising.refulsal} />
            <MiniDocWrap doc={fundraising.legal} />
            <MiniDocWrap doc={fundraising.investor} />
            <MiniDocWrap doc={fundraising.consent} />
            <MiniDocWrap doc={fundraising.stockholder} />
            <MiniDocWrap doc={fundraising.securities} />
            <MiniDocWrap doc={fundraising.side} />
            <MiniDocWrap doc={fundraising.articles} />
            <MiniDocWrap doc={fundraising.forma} />
            <MiniDocWrap doc={fundraising.preferred} />
          </MiniDocDisplay>
        </td>
        <td className={classes.appear}>
          <ActionIcon component={NextLink} ml='auto' href={`/fundraising/${id}`}>
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
            <th>Fundraising Round</th>
            <th>Date</th>
            <th>Documents</th>
          </tr>
        </thead>

        {fundraisings.length === 0 && (
          <FullScreenMsg title='No employee data'>
            <AddEquity />
          </FullScreenMsg>
        )}

        {fundraisings.length > 0 && <tbody>{rows}</tbody>}
      </Table>
    </Box>
  )
}

export const OptionPlanDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.optionPlan.useDocumentSnapshot(doc(cruds.optionPlan.collection, id))
  const optionPlan = snap?.data
  if (!optionPlan) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={optionPlan.startDate} />
          <MetadataRow name='End Date' metadata={optionPlan.endDate} />
          <MetadataRow name='PoolSize' metadata={optionPlan.poolSize} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(optionPlan.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}

export const FundraisingDetail: React.FC<{ id: string }> = ({ id }) => {
  const { snap } = cruds.fundraising.useDocumentSnapshot(doc(cruds.fundraising.collection, id))
  const fundraising = snap?.data
  if (!fundraising) return <Loader />

  return (
    <Stack spacing='xl' py='xl' sx={({ other }) => ({ maxWidth: other.widths.md })}>
      <Title order={2}>Metadata</Title>
      <Table striped>
        <tbody>
          <MetadataRow name='Start Date' metadata={fundraising.sharePrice} />
          <MetadataRow name='End Date' metadata={fundraising.startDate} />
          <MetadataRow name='PoolSize' metadata={fundraising.shares} />
        </tbody>
      </Table>
      <Table />
      <Title order={2}>Documents</Title>
      {DocGroup.toDocGroups(fundraising.docs).map((docGroup, key) => (
        <DocGroupComp docGroup={docGroup} key={key} />
      ))}
    </Stack>
  )
}
