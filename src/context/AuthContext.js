//----------
//  React Imports
//----------
import { createContext, useEffect, useState } from 'react'

//----------
//  Next Imports
//----------
import { useRouter } from 'next/router'

//----------
//  Other Library Imports
//----------
import axios from 'axios'

//----------
//  Local Imports
//----------
import authConfig from 'src/configs/auth'

//----------
//  Default
//----------
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  //----------
  //  States
  //----------
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const storedUser = JSON.parse(window.localStorage.getItem('userData'))

      if (storedToken) {
        setLoading(false)
        setUser({ ...storedUser })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  //----------
  //  Hooks
  //----------
  const router = useRouter()

  const handleLogin = (params, cb) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/login`, {
        email: params.email,
        password: params.password
      })
      .then(resp => {
        let response = resp.data.data
        const user = {
          id: response.id,
          username: response.username,
          email: response.email,
          name: `${response.first_name} ${response.last_name}`,
          image: response.cmp_logo,
          role: 'ADMIN'
        }
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.accessToken)
        localStorage.setItem('userData', JSON.stringify(user))
        cb({ success: true })
        router.replace('/dashboard')
        window.location.reload()
      })
      .catch(error => {
        if (error.response) {
          let toastError = []
          if (error.response.data.errors) {
            error.response.data.errors.map(err => toastError.push(err.msg))
          } else if (!error.response.data.success) {
            toastError.push(error.response.data.message)
          }
          cb({ success: false, message: toastError.reverse() })
        }
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
