import { Text } from '@mantine/core'
import { useModals } from '@mantine/modals'
import React from 'react'
import { createContainer } from 'unstated-next'

export const modalZIndex = 1000

type IModalState =
  | { type: 'close' } // Modal is closed
  | { type: 'open' } // Modal is open with no file
  // Modal is open with file
  | { type: 'file'; data: ArrayBuffer }
  // Modal is open with url to an already uploaded file
  | { type: 'url'; data: string }

const _toDataUrl = (data: ArrayBuffer): string => {
  const base64Data = Buffer.from(data).toString('base64')
  return `data:application/pdf;base64,${base64Data}`
}

const toDataUrl = (state: IModalState): string | undefined => {
  switch (state.type) {
    case 'file':
      return _toDataUrl(state.data)
    case 'url':
      return state.data
    default:
      return undefined
  }
}

export const ModalState = createContainer(() => {
  const [state, setState] = React.useState<IModalState>({ type: 'close' })
  const [fullPage, setFullPage] = React.useState<boolean>(false)
  const modals = useModals()
  const directClose = () => setState({ type: 'close' })

  const confirmClose = () => {
    modals.openConfirmModal({
      title: 'Discard Uploaded Document',
      children: (
        <Text size='sm'>Are you sure you want to permanently discard the uploaded document?</Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: directClose,
      zIndex: modalZIndex + 1,
    })
  }

  // Save result, although for now, it just closes the modal.
  const save = () => {
    directClose()
  }

  return {
    state,
    isOpen: state.type !== 'close' && !fullPage,
    open: () => setState({ type: 'open' }),
    url: toDataUrl(state),
    close: state.type === 'file' ? confirmClose : directClose,
    save,
    setFile: (data: ArrayBuffer) => setState({ type: 'file', data }),
    // Wrap in `useCallback` because it will be passed to `useEffect`
    setUrl: React.useCallback((data: string) => setState({ type: 'url', data }), [setState]),
    setFullPage,
  }
})
