import { Button, Center, Group, Notification, Stack, Text, useMantineTheme } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from '@mantine/dropzone'
import React from 'react'
import { CloudUpload, X } from 'tabler-icons-react'
import { ModalState } from './state'

export const DocDrop: React.FC = () => {
  const theme = useMantineTheme()
  const [error, setError] = React.useState<string | null>(null)
  const { setFile } = ModalState.useContainer()

  return (
    <Stack sx={{ height: '100%' }}>
      <Dropzone
        onDrop={(files) => files[0].arrayBuffer().then(setFile)}
        onReject={(error_) => setError(error_[0].errors[0].message)}
        accept={[...MS_WORD_MIME_TYPE, ...PDF_MIME_TYPE, ...IMAGE_MIME_TYPE]}
        multiple={false}
        maxSize={5 * 1024 * 1024}
        sx={{ height: '100%' }}
      >
        {() => (
          <Stack justify='center' align='center' p='xl' spacing='lg' sx={{ height: '100%' }}>
            <Group spacing='xl'>
              <CloudUpload color={theme.colors.primary[6]} size={64} />
              <Stack spacing='sm'>
                <Text size='xl' inline>
                  Drag Documents Here
                </Text>
                <Text size='sm' color='dimmed' inline>
                  5MB Maximum Size
                </Text>
              </Stack>
            </Group>
            <Text size='lg' color='dimmed'>
              or
            </Text>
            <Button>Browse Files</Button>
          </Stack>
        )}
      </Dropzone>
      {error && (
        <Center>
          <Notification
            icon={<X size={18} />}
            color='red'
            title='Upload Error'
            onClose={() => setError(null)}
          >
            {error}
          </Notification>
        </Center>
      )}
    </Stack>
  )
}
