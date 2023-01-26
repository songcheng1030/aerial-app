import { createStyles } from '@mantine/core'

/**
 * Creates CSS classes so that `appear` becomes visible when mouse hovers over `hover`.
 * @param delay: delay time, default '300ms'
 * @returns { hover, appear }
 */

export const useHoverChildAppear = (delay = '250ms') => {
  const useStyles = createStyles((theme, param, getRef) => ({
    hover: {
      [`& .${getRef('appear')}`]: { opacity: 0, transition: `opacity ${delay} ease-in` },
      [`&:hover .${getRef('appear')}`]: {
        opacity: 1,
        transition: `opacity ${delay} ease-in`,
        transitionDelay: delay,
      },
    },
    appear: {
      ref: getRef('appear'),
    },
  }))
  return useStyles()
}
