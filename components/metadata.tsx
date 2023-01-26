import { Badge, Loader } from '@mantine/core'
import * as React from 'react'
import { Metadata } from '../lib/schema'
import { MiniDoc } from './minidoc'
import { HoverEdit, metadataRowHover } from './util'

export const DisplaySource: React.FC<{ metadata?: Metadata }> = ({ metadata }) => {
  if (!metadata) return null
  switch (metadata.type) {
    case 'document': {
      const docType = metadata.source?.type
      return docType === undefined ? <Loader size='sm' /> : <MiniDoc type={docType} />
    }
    case 'computed':
      return <Badge>Computed</Badge>
    case 'edited':
      return <Badge>Edited</Badge>
    default:
      throw new Error('Unexpected value for metadata type')
  }
}

export interface IMetadataRowProps {
  metadata?: Metadata
  name: string
  fallback?: React.ReactNode
  inlineEdit?: React.ReactNode
}

export const MetadataRow: React.FC<IMetadataRowProps> = ({
  metadata,
  name,
  fallback = 'None',
  inlineEdit,
}) => {
  const { classes } = metadataRowHover()

  return (
    <tr className={classes.hover}>
      <td>{name}</td>
      <td>
        {!inlineEdit ? metadata ? <HoverEdit>{metadata.string}</HoverEdit> : fallback : inlineEdit}
      </td>
      <td>
        <DisplaySource metadata={metadata} />
      </td>
    </tr>
  )
}
