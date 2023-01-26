import { useRouter } from 'next/router'

export const useSearchQuery = () => {
  const router = useRouter()
  const { q } = router.query
  return q ? (Array.isArray(q) ? q[0] : q) : null
}
