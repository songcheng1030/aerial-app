import { AppShell, ScrollArea } from '@mantine/core'
import { AppHeader } from './header'
import { AppNavbar } from './navbar'

export const Layout: React.FC<{ noScroll?: boolean }> = ({ children, noScroll }) => (
  <AppShell fixed navbar={<AppNavbar />} header={<AppHeader />} padding='xl'>
    {noScroll ? children : <ScrollArea style={{ height: '100%' }}>{children}</ScrollArea>}
  </AppShell>
)
