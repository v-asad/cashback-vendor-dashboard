//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
//  MUI Lib
//----------
import { Grid, Typography } from '@mui/material'

//----------
//  Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Other Library Imports
//----------
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Profile = () => {
  // Hooks
  const auth = useAuth()

  //----------
  // States
  //----------
  const [data, setData] = useState([])
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/terms-and-conditions`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(resp => {
          setData(resp.data)
        })
        .catch(error => {
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
    }
    loadData()
  }, [])

  return (
    <>
      <Grid container spacing={6}>
        <h2>TERMS & CONDITIONS</h2>
        
        <Typography>{data.description}</Typography>
      </Grid>
    </>
  )
}

export default Profile
