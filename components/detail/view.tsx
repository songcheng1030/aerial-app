import { Card } from '@mantine/core'
import React from 'react'

interface DocViewProps {
  url: string
}

export const DocView: React.FC<DocViewProps> = ({ url }) => {
  const fullUrl = `${url}#view=FitH&navpanes=0&toolbar=0&scrollbar=1`

  return (
    <Card
      p='sm'
      pt='xs'
      withBorder
      sx={{
        backgroundColor: '#505255' /* match color on chrome pdf viewer */,
        height: '100%',
        overflow: 'clip',
      }}
    >
      <iframe frameBorder='0' src={fullUrl} width='100%' height='100%' title='PDF View' />
    </Card>
  )
}
