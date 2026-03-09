import { useEffect } from 'react'

export const useAlIniciar = (callbackInicial: () => void) => {
  useEffect(() => {
    callbackInicial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

