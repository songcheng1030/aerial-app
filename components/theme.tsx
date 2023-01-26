import { DefaultMantineColor, Global, MantineProvider, Tuple, useMantineTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Detail } from './detail'

type ExtendedCustomColors = 'primary' | 'urgent' | 'go' | 'inactive' | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }

  export interface MantineThemeOther {
    widths: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>
    navbarWidth: number
  }
}

export const Theme: React.FC = ({ children }) => {
  const origTheme = useMantineTheme()

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      // https://github.com/mantinedev/mantine/discussions/1118
      emotionOptions={{ key: 'mantine' }}
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
        colors: {
          primary: origTheme.colors.blue,
          urgent: origTheme.colors.yellow,
          go: origTheme.colors.green,
          inactive: origTheme.colors.gray.map((c) => origTheme.fn.lighten(c, 0.5)) as Tuple<
            string,
            10
          >,
        },
        other: {
          widths: {
            xs: 200,
            sm: 400,
            md: 768,
            lg: 100,
            xl: 1200,
          },
          navbarWidth: 260,
        },
      }}
      defaultProps={{
        Button: { color: 'primary', variant: 'outline', uppercase: true },
        Table: {
          horizontalSpacing: 'md',
          verticalSpacing: 'sm',
          fontSize: 'md',
        },
        Badge: {
          variant: 'outline',
        },
        ActionIcon: {
          color: 'primary',
          variant: 'transparent',
        },
      }}
      styles={{
        Tabs: (theme) => ({
          tabLabel: {
            fontSize: theme.fontSizes.md,
            padding: theme.spacing.sm,
          },
        }),
        Menu: (theme) => ({
          itemLabel: {
            color: 'inherit',
            fontSize: theme.fontSizes.md,
          },
          itemBody: {
            color: 'inherit',
          },
        }),
        UnstyledButton: {
          root: {
            color: 'inherit',
          },
        },
        Button: {
          root: {
            backgroundColor: 'white',
          },
        },
      }}
    >
      <Global
        styles={(theme) => ({
          body: { color: theme.colors.gray[8] },
        })}
      />
      <ModalsProvider>
        <Detail.Provider>{children}</Detail.Provider>
      </ModalsProvider>
    </MantineProvider>
  )
}
