import {
  Alert,
  Box,
  Button,
  Collapse,
  filterChildrenByType,
  Group,
  Select,
  Timeline,
  TimelineItem,
  TimelineProps,
} from '@mantine/core'
import Image from 'next/image'
import React from 'react'
import { AlertCircle } from 'tabler-icons-react'

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Washington, D.C.',
] as const
type States = typeof states[number]

const LimitedTimeline: React.FC<TimelineProps> = (props) => {
  const { children, ...rest } = props
  const _children = filterChildrenByType(children, TimelineItem)
  return (
    <Timeline {...rest} reverseActive active={0}>
      {_children.slice(0, rest.active)}
    </Timeline>
  )
}

const ButtonGroup: React.FC<{
  value: number | null
  setValue: (_: number | null) => void
  values: string[]
}> = ({ value, setValue, values }) => {
  return (
    <Group>
      {values.map((val, i) => (
        <Button key={i} variant={i === value ? 'filled' : 'outline'} onClick={() => setValue(i)}>
          {val}
        </Button>
      ))}
    </Group>
  )
}

export const LawyerAlert: React.FC<{
  opened: boolean
  title: string
  message: string
}> = ({ opened, title, message }) => (
  <Collapse in={opened}>
    <Alert icon={<AlertCircle />} title={title} color='urgent' mt='md'>
      {message}
      <Group my='sm' spacing='sm'>
        <Image
          src='/lawyer.jpg'
          width={42}
          height={42}
          style={{ borderRadius: '42px' }}
          alt='Mary Williams Lawyer'
        />
        <Box>
          <b>Mary Williams</b>
          <br />
          <a href='mailto:mary.williams@klgates.com'>mary.williams@klgates.com</a>
        </Box>
      </Group>
    </Alert>
  </Collapse>
)

export const NoTemplate: React.FC<{ opened: boolean; template: string }> = ({
  opened,
  template,
}) => (
  <LawyerAlert
    opened={opened}
    title={`No ${template}!`}
    message={`You do not have any ${template}. Contact your lawyer for a form template.`}
  />
)

export const Preamble: React.FC = ({ children }) => {
  const [type, setType] = React.useState<number | null>(null)
  const [location, setLocation] = React.useState<number | null>(null)
  const [state, setState] = React.useState<States | null>(null)

  const activeNumber = () => {
    if (type !== 1) return 1
    if (location !== 0) return 2
    if (state !== 'Washington') return 3
    return 4
  }

  return (
    <LimitedTimeline active={activeNumber()} bulletSize={24} lineWidth={2}>
      <Timeline.Item bullet={1} title='Type'>
        <ButtonGroup value={type} setValue={setType} values={['Contractor', 'Employee']} />
        <NoTemplate opened={type === 0} template='contractor agreement templates' />
      </Timeline.Item>

      <Timeline.Item bullet={2} title='Location'>
        <ButtonGroup
          value={location}
          setValue={setLocation}
          values={['US-based', 'International']}
        />
        <NoTemplate
          opened={location === 1}
          template='international employment agreement templates'
        />
      </Timeline.Item>

      <Timeline.Item bullet={3} title='US State'>
        <Group>
          <Select
            label='Employee State'
            placeholder='Select State'
            value={state}
            searchable
            onChange={setState as (e: string) => void}
            data={states.map((s) => ({ value: s, label: s }))}
          />
        </Group>
        <NoTemplate
          opened={state !== 'Washington' && state !== null}
          template={`${state} employment templates`}
        />
      </Timeline.Item>

      <Timeline.Item bullet={4} title='Employee Information'>
        {children}
      </Timeline.Item>
    </LimitedTimeline>
  )
}
