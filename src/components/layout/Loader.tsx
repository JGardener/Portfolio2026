import { useEffect } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  useEffect(() => {
    onComplete()
  }, [onComplete])
  return null
}
