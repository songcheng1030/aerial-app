import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  NumberInput,
  NumberInputProps,
  Popover,
} from '@mantine/core'
import { DatePicker, DatePickerProps } from '@mantine/dates'
import { useForm } from '@mantine/form'
import * as React from 'react'
import { Edit, EditOff } from 'tabler-icons-react'
import { z } from 'zod'
import { MetadataDate, MetadataNumber, MetadataPrice } from '../../lib/schema'

// TODO: find a way to make InlinePriceInput and InlineDateInput less repetitive

export const metadataRowHover = createStyles((theme, param, getRef) => ({
  hover: {
    [`& .${getRef('appear')}`]: { opacity: 0, transition: `opacity 250ms ease-in` },
    [`&:hover .${getRef('appear')}`]: {
      opacity: 1,
      transition: `opacity 100ms ease-in`,
      transitionDelay: '100ms',
    },
  },
  appear: {
    ref: getRef('appear'),
  },
}))

export const HoverEdit: React.FC<{ onClick?: () => void }> = ({ children, onClick }) => {
  const editable = !!onClick

  const { classes } = metadataRowHover()

  return (
    <Group spacing='xs'>
      <Box>{children}</Box>

      {editable ? (
        <ActionIcon className={classes.appear} onClick={onClick}>
          <Edit />
        </ActionIcon>
      ) : (
        <ActionIcon className={classes.appear} color='inactive' sx={{ pointer: 'not-allowed' }}>
          <EditOff />
        </ActionIcon>
      )}
    </Group>
  )
}

export const InlinePriceInput: React.FC<
  NumberInputProps & {
    initialValue?: MetadataPrice
    update: (value: z.input<typeof MetadataPrice>) => void
  }
> = ({ update, initialValue, ...props }) => {
  const [openPopover, setOpenPopover] = React.useState(false)

  const form = useForm({
    initialValues: {
      value: initialValue?.value,
    },

    validate: {
      value: (value?: number) => (value ? null : 'enter a value'),
    },
  })

  return (
    <Popover
      opened={openPopover}
      onClose={() => setOpenPopover(false)}
      position='bottom'
      placement='center'
      trapFocus={false}
      transition='fade'
      styles={({ spacing }) => ({ inner: { padding: spacing.sm } })}
      target={<HoverEdit onClick={() => setOpenPopover(true)}>{initialValue?.string}</HoverEdit>}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (!values.value) return // this is just to stay type safe, validate already handles this
          update({ value: values.value, type: 'edited' })
          setOpenPopover(false)
        })}
      >
        <Group spacing={6}>
          <NumberInput
            required
            {...props}
            {...form.getInputProps('value')}
            autoFocus
            precision={2}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value!))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : `$ `
            }
            styles={{
              input: { width: 120 },
            }}
          />
          <Button
            color='gray'
            variant='subtle'
            size='sm'
            onClick={() => {
              setOpenPopover(false)
            }}
          >
            Cancel
          </Button>
          <Button type='submit' size='sm'>
            Save
          </Button>
        </Group>
      </form>
    </Popover>
  )
}

// Todo: accept a parser/ formatter prop or just type for the input so as to combine price and number inputs

export const InlineNumberInput: React.FC<
  NumberInputProps & {
    initialValue?: MetadataNumber
    update: (value: z.input<typeof MetadataPrice>) => void
  }
> = ({ update, initialValue, ...props }) => {
  const [openPopover, setOpenPopover] = React.useState(false)

  const form = useForm({
    initialValues: {
      value: initialValue?.value,
    },

    validate: {
      value: (value?: number) => (value ? null : 'enter a value'),
    },
  })

  return (
    <Popover
      opened={openPopover}
      onClose={() => setOpenPopover(false)}
      position='bottom'
      placement='center'
      trapFocus={false}
      transition='fade'
      styles={({ spacing }) => ({ inner: { padding: spacing.sm } })}
      target={<HoverEdit onClick={() => setOpenPopover(true)}>{initialValue?.string}</HoverEdit>}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (!values.value) return // this is just to stay type safe, validate already handles this
          update({ value: values.value, type: 'edited' })
          setOpenPopover(false)
        })}
      >
        <Group spacing={6}>
          <NumberInput
            required
            {...props}
            {...form.getInputProps('value')}
            autoFocus
            precision={2}
            styles={{
              input: { width: 120 },
            }}
          />
          <Button
            color='gray'
            variant='subtle'
            size='sm'
            onClick={() => {
              setOpenPopover(false)
            }}
          >
            Cancel
          </Button>
          <Button type='submit' size='sm'>
            Save
          </Button>
        </Group>
      </form>
    </Popover>
  )
}

export const InlineDateInput: React.FC<
  DatePickerProps & {
    initialValue?: MetadataDate
    update: (value: z.input<typeof MetadataDate>) => void
  }
> = ({ update, initialValue, ...props }) => {
  const [openPopover, setOpenPopover] = React.useState(false)

  const form = useForm({
    initialValues: {
      value: initialValue?.value,
    },

    validate: {
      value: (value?: Date) => (value ? null : 'enter a value'),
    },
  })

  return (
    <Popover
      opened={openPopover}
      onClose={() => setOpenPopover(false)}
      position='bottom'
      placement='center'
      transition='fade'
      styles={({ spacing }) => ({ inner: { padding: spacing.sm } })}
      target={<HoverEdit onClick={() => setOpenPopover(true)}>{initialValue?.string}</HoverEdit>}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (!values.value) return // this is just to stay type safe, validate already handles this
          update({ value: values.value, type: 'edited' })
          setOpenPopover(false)
        })}
      >
        <Group spacing={6}>
          <DatePicker
            {...props}
            {...form.getInputProps('value')}
            withinPortal={false}
            styles={{
              input: { width: 150 },
            }}
            required
          />
          <Button
            color='gray'
            variant='subtle'
            size='sm'
            onClick={() => {
              setOpenPopover(false)
            }}
          >
            Cancel
          </Button>
          <Button type='submit' size='sm'>
            Save
          </Button>
        </Group>
      </form>
    </Popover>
  )
}
