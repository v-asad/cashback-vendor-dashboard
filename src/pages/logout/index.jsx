//----------
//  React Imports
//----------
import { useEffect } from 'react'

//----------
//  Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const index = () => {
  //----------
  //  Hooks
  //----------
  const { logout } = useAuth()

  //----------
  //  States
  //----------
  useEffect(() => {
    logout()
  }, [])
  return null
}

export default index
