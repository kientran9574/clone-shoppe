import { useContext, useEffect } from 'react'
import useRouterElement from './useRouterElement'
import { AppContext } from './context/app.context'
import { LocalStorageEventTarget } from './utils/auth'
const App = () => {
  const routerElement = useRouterElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearToLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearToLS', reset)
    }
  }, [reset])
  return <div>{routerElement}</div>
}

export default App
