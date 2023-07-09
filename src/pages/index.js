//----------
//  React Imports
//----------
import { useEffect } from 'react'

//----------
//  Next Imports
//----------
import { useRouter } from 'next/router'

//----------
//  Spinner Import
//----------
import Spinner from 'src/@core/components/spinner'

//----------
//  Local Import
//----------
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'

//----------
//  Set Home URL based on User Roles
//----------
export const getHomeRoute = role => {
  const existing = authConfig.roles.find(r => role.name === role)
  console.log(existing)
  if (existing) return existing.homepage
  else return '/dashboard'
}

const Home = () => {
  //----------
  //  Hooks
  //----------
  const auth = useAuth()
  const router = useRouter()

  //----------
  //  States
  //----------
  useEffect(() => {
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
