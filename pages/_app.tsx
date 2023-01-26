import { ColorScheme, ColorSchemeProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { withTRPC } from '@trpc/next'
import { getCookie, setCookie } from 'cookies-next'
import { GetServerSidePropsContext } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import superjson from 'superjson'
import { LoginRequired } from '../components/login'
import { Theme } from '../components/theme'
import type { AppRouter } from '../lib/trpc.front'

const queryClient = new QueryClient()

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme)

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 })
  }

  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <Theme>
            {/* this was placed here to fix an unsubscribe error (see README) */}
            <LoginRequired>
              <NotificationsProvider>
                <Component {...pageProps} />
              </NotificationsProvider>
            </LoginRequired>
          </Theme>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </>
  )
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
})

export default withTRPC<AppRouter>({
  config({ ctx }) {
    // during client requests
    // https://trpc.io/docs/ssr
    // https://stackoverflow.com/a/59562136/8930600
    if (typeof window !== 'undefined') {
      return {
        url: '/api/trpc',
        transformer: superjson,
      }
    }

    // during SSR below

    // optional: use SSG-caching for each rendered page (see caching section for more details)
    const ONE_DAY_SECONDS = 60 * 60 * 24
    ctx?.res?.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`)

    // The server needs to know your app's full url
    // cannot use envsafe because `VERCEL_URL` is not set but required during build
    const url = `https://${process.env.VERCEL_URL ?? 'localhost:3000'}/api/trpc`

    return {
      url,
      headers: {
        // optional - inform server that it's an ssr request
        'x-ssr': '1',
      },
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      transformer: superjson,
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  // ssr: true,
})(App)
