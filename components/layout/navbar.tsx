import {
  Badge,
  Box,
  Button,
  Collapse,
  Group,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useState } from 'react'
import {
  Building,
  ChartPie,
  ChevronRight,
  History,
  ListCheck,
  Microscope,
  Plus,
  ReportMoney,
  TriangleSquareCircle,
  User,
  Users,
} from 'tabler-icons-react'
import { actionItems } from '../../lib/state'
import { Detail } from '../detail'
import { RouteData, topRouteMap } from '../route'
import { OptLink } from '../util'

type NavbarLinkProps = {
  icon?: React.ReactNode
  text: string
  path?: string
  badge?: string
  open?: boolean
  topNav?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  icon,
  text,
  path,
  open,
  badge,
  topNav,
  onClick = () => {},
}) => {
  const disabled = !path

  const content = (
    <Group
      onClick={onClick}
      spacing='md'
      position='left'
      sx={() => ({
        cursor: 'pointer',
      })}
    >
      <Box
        className='icon'
        sx={(theme) => ({
          flex: 'none',
          width: '24px',
          color: theme.colors.blue[5],
        })}
      >
        {/* Inexplicably, you cannot use ActionIcon here.  If you do,
                Mantine will create two <main>. */}
        {icon}
      </Box>
      <Text sx={{ flex: 'auto', maxWidth: 'none' }}>{text}</Text>
      {topNav && (
        <Box
          className='icon'
          sx={(theme) => ({
            flex: 'none',
            color: theme.colors.blue[5],
            transform: open ? 'rotate(90deg)' : 'revert',
            transition: 'transform 0.35s ease-in-out 0s',
          })}
        >
          <ChevronRight />
        </Box>
      )}
    </Group>
  )

  const contentWithBadge = badge ? (
    <Group spacing={0} position='apart'>
      {content}
      <Badge color='urgent' size='lg' sx={{ flex: 'none' }} variant='filled'>
        {badge}
      </Badge>
    </Group>
  ) : (
    content
  )

  return (
    <OptLink href={path}>
      <UnstyledButton
        p='sm'
        disabled={disabled}
        sx={(theme) => ({
          width: '100%',
          '&:hover': {
            backgroundColor: disabled ? undefined : theme.colors.gray[1],
          },
          cursor: disabled ? 'default' : undefined,
        })}
      >
        {contentWithBadge}
      </UnstyledButton>
    </OptLink>
  )
}

type NavbarLinkGroup = {
  icon: React.ReactNode
  text: string
}

const NavbarLinkGroup: React.FC<NavbarLinkGroup> = ({ children, ...parent }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <NavbarLink
        {...parent}
        topNav
        open={open}
        onClick={() => {
          setOpen(!open)
        }}
      />
      <Collapse in={open} transitionDuration={500}>
        {children}
      </Collapse>
    </Box>
  )
}

const RouteLink: React.FC<{ icon?: React.ReactNode; route: RouteData }> = ({ icon, route }) => {
  return <NavbarLink text={route.name} path={`/${route.collection}`} icon={icon} />
}

export const AppNavbar: React.FC = () => {
  const { other } = useMantineTheme()
  const { open } = Detail.useState()

  return (
    <Navbar width={{ base: other.navbarWidth }}>
      <Button size='md' uppercase m='12px' p='sm' onClick={open} leftIcon={<Plus />}>
        Add Document
      </Button>
      <ScrollArea sx={{ flex: 'auto' }}>
        <NavbarLink
          icon={<ListCheck />}
          text='Action Items'
          path='/action-items'
          badge={actionItems.length.toString()}
        />
        <Navbar.Section>
          <Group position='apart' px='12px'>
            <Text
              transform='uppercase'
              weight={600}
              size='sm'
              color='dimmed'
              align='left'
              py='12px'
            >
              Documents
            </Text>
          </Group>
          <NavbarLinkGroup icon={<Building />} text='Corporate'>
            <RouteLink route={topRouteMap.summary} />
            <RouteLink route={topRouteMap['primary-documents']} />
            <RouteLink route={topRouteMap['state-and-local']} />
            <RouteLink route={topRouteMap.insurance} />
            <RouteLink route={topRouteMap['real-estate']} />
            <RouteLink route={topRouteMap['benefit-plan']} />
          </NavbarLinkGroup>

          <NavbarLinkGroup icon={<Users />} text='Personnel'>
            <RouteLink route={topRouteMap.employee} />
            <RouteLink route={topRouteMap.officer} />
            <RouteLink route={topRouteMap.director} />
            <RouteLink route={topRouteMap.advisor} />
          </NavbarLinkGroup>
          <NavbarLinkGroup icon={<ChartPie />} text='Equity'>
            <RouteLink route={topRouteMap['cap-table']} />
            <RouteLink route={topRouteMap['stock-option-plan']} />
            <RouteLink route={topRouteMap.valuation} />
            <RouteLink route={topRouteMap.fundraising} />
          </NavbarLinkGroup>
          <NavbarLinkGroup icon={<User />} text='Third Party'>
            <RouteLink route={topRouteMap.customer} />
            <RouteLink route={topRouteMap.contractor} />
          </NavbarLinkGroup>
          <NavbarLinkGroup icon={<Microscope />} text='Intellectual Property'>
            <RouteLink route={topRouteMap.patent} />
            <RouteLink route={topRouteMap.trademark} />
            <RouteLink route={topRouteMap.copyright} />
          </NavbarLinkGroup>
          <NavbarLinkGroup icon={<ReportMoney />} text='Finance'>
            <RouteLink route={topRouteMap.financials} />
            <RouteLink route={topRouteMap.tax} />
            <RouteLink route={topRouteMap.debt} />
          </NavbarLinkGroup>
          <NavbarLinkGroup icon={<TriangleSquareCircle />} text='Other Documents'>
            <RouteLink route={topRouteMap.miscellaneous} />
            <RouteLink route={topRouteMap.processing} />
          </NavbarLinkGroup>
          <NavbarLink icon={<History />} text='History' path='history' />
        </Navbar.Section>
      </ScrollArea>
    </Navbar>
  )
}
