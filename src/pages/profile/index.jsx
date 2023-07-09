//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from 'react'

//----------
//  MUI Lib
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  TextField,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  DeleteForeverIcon,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress
} from '@mui/material'

//----------
//  Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Icon Imports
//----------
import Icon from 'src/@core/components/icon'

//----------
//  Other Library Imports
//----------
import axios from 'axios'
import { toast } from 'react-hot-toast'

//----------
//  Constants
//----------
const scroll = 'paper'

const Profile = () => {
  const auth = useAuth()
  //----------
  // States
  //----------
  const [profile, setProfile] = useState([])
  const [companyregno, setCompanyregno] = useState('')
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [commisionper, setCommisionper] = useState(0)
  const [creditlimit, setCreditlimit] = useState(0)
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [lendmark, setLendmark] = useState('')
  const [telephone, setTelephone] = useState('')
  const [phonecode, setPhonecode] = useState('')
  const [description, setDescription] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNo, setAccountNo] = useState('')
  const [bankName, setBankName] = useState('')
  const [branchName, setBranchName] = useState('')
  const [swiftCode, setSwiftCode] = useState('')
  const [gallery, setGallery] = useState([])
  const [cmpLogo, setCmpLogo] = useState('')

  const [uploadLogo, setUploadLogo] = useState(null)
  const [uploadGallery, setUploadGallery] = useState([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [id, setId] = useState(null)
  const [open, setOpen] = useState(false)

  // const [user, setUser] = useState({
  //   // profile: [],
  //   companyregno: '',
  //   username: '',
  //   firstname: '',
  //   commisionper: 0,
  //   creditlimit: 0,
  //   email: '',
  //   address: '',
  //   lendmark: '',
  //   telephone: '',
  //   phonecode: '',
  //   description: '',
  //   accountName: '',
  //   accountNo: '',
  //   bankName: '',
  //   branchName: '',
  //   swiftCode: '',
  //   gallery: [],
  //   cmpLogo: ''
  // })
  const descriptionElementRef = useRef(null)
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  useEffect(() => {
    const loadProfile = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          let user = response.data
          // setUser(response.data)
          console.table(user)

          setCompanyregno(user.company_reg_no || '')
          setUsername(user.username || '')
          setFirstname(user.first_name || '')
          setCommisionper(user.commission_percent || 0)
          setCreditlimit(user.credit_limit || 0)
          setEmail(user.email || '')
          setAddress(user.address || '')
          setLendmark(user.lendmark || '')
          setPhonecode(user.phonecode || '')
          setTelephone(user.telephone || '')
          setDescription(user.description || '')
          setAccountName(user.acc_name || '')
          setAccountNo(user.ac_no || '')
          setBankName(user.bank_nm || '')
          setBranchName(user.branch_nm || '')
          setSwiftCode(user.swift_code || '')
          // setGallery(user.file || [])
          setCmpLogo(user.cmp_logo || '')
          setProfile(user)
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
    loadProfile()
  }, [])

  //----------
  //  Refs
  //----------

  const submitLogoHandler = () => {
    // Create a new FormData object to store the logo file
    const formData = new FormData()
    formData.append('cmp_logo', uploadLogo)

    // Open the loading modal
    setOpen(true)

    // Send a POST request to update the logo
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/logo/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        // Close the loading modal
        setOpen(false)

        let data = resp.data
        if (data.success) {
          // Show success toast message
          toast.success(data.message)
        } else {
          // Show error toast message
          toast.error(data.message)
        }

        // Update the logo state with the new logo URL
        setCmpLogo(data.cmp_logo)

        // Reset the uploadLogo state to null
        setUploadLogo(null)
      })
      .catch(error => {
        // Close the loading modal
        setOpen(false)

        // Show error toast message
        toast.error(
          `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
        )

        if (error.response && error.response.status == 401) {
          // Logout the user if the response status is 401 (Unauthorized)
          auth.logout()
        }
      })
  }

  const deleteItem = id => {
    // Set the id of the item to be deleted
    setId(id)

    // Open the delete confirmation modal
    setDeleteModalOpen(true)
  }

  const handleClose = () => {
    setDeleteModalOpen(false)
  }

  const galleryUploadHandler = () => {
    // Create a new FormData object to store the gallery files
    const formData = new FormData()

    // Append each file in uploadGallery to the formData
    for (let i = 0; i < uploadGallery.length; i++) {
      formData.append('gallery', uploadGallery[i])
    }

    // Open the loading modal
    setOpen(true)

    // Send a POST request to update the gallery
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/gallery/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        // Close the loading modal
        setOpen(false)

        let data = resp.data
        if (data.success) {
          // Show success toast message
          toast.success(data.message)
        } else {
          // Show error toast message
          toast.error(data.message)
        }

        // Update the gallery state with the new files
        setGallery(data.files)

        // Reset the uploadGallery state to an empty array
        setUploadGallery([])
      })
      .catch(error => {
        // Close the loading modal
        setOpen(false)

        // Show error toast message
        toast.error(
          `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
        )

        if (error.response && error.response.status == 401) {
          // Logout the user if the response status is 401 (Unauthorized)
          auth.logout()
        }
      })
  }

  const removeGallery = () => {
    // Split the id string by '/' and reverse the resulting array
    let parts = id.split('/').reverse()

    // Open the loading modal
    setOpen(true)

    // Send a DELETE request to remove the gallery item
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/gallery/remove/${parts[0]}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        // Close the loading modal
        setOpen(false)

        // Close the delete confirmation modal
        setDeleteModalOpen(false)

        // Show success toast message
        toast.success(response.data.message)

        // Update the gallery state with the new files
        setGallery(response.data.files)
      })
      .catch(error => {
        // Close the loading modal
        setOpen(false)

        // Close the delete confirmation modal
        setDeleteModalOpen(false)

        // Show error toast message
        toast.error(
          `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
        )

        if (error.response && error.response.status == 401) {
          // Logout the user if the response status is 401 (Unauthorized)
          auth.logout()
        }
      })
  }

  const handleLogoUpload = event => {
    // Get the selected image file from the event
    const selectedImage = event.target.files[0]

    // Set the uploadLogo state to the selected image
    setUploadLogo(selectedImage)
  }

  const handleGalleryUpload = event => {
    setUploadGallery(event.target.files)
  }

  const updateProfile = () => {
    // Prepare the data to be updated with the required fields
    let dataToUpdate = {
      company_reg_no: companyregno,
      first_name: firstname,
      email: email,
      address: address,
      lendmark: lendmark,
      state: 'Punjab',
      city: 'Attock',
      phonecode: phonecode,
      telephone: telephone,
      description: description
    }

    // Open the loading modal
    setOpen(true)

    // Send a POST request to update the profile
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/profile/update`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        // Close the loading modal
        setOpen(false)

        let data = resp.data
        if (data.success) {
          // Show success toast message
          toast.success(data.message)
        } else {
          // Show error toast message
          toast.error(data.message)
        }
      })
      .catch(error => {
        // Close the loading modal
        setOpen(false)

        // Show error toast message
        toast.error(
          `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
        )

        if (error.response && error.response.status == 401) {
          // Logout the user if the response status is 401 (Unauthorized)
          auth.logout()
        }
      })
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box
            sx={{
              py: 3,
              px: 4,
              borderRadius: 1,
              cursor: 'pointer',

              border: theme => `1px solid ${theme.palette.primary.main}`
            }}
          >
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon icon='mdi:home-outline' />
              <Typography variant='h6' sx={{ color: 'primary.main' }}>
                Personal Information
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            xs={6}
            onChange={e => setCompanyregno(e.target.value)}
            value={companyregno}
            fullWidth
            label='Company Registration Number:'
            placeholder='Company Registration Number:'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setFirstname(e.target.value)}
            value={firstname}
            fullWidth
            label='Company Name:'
            placeholder='Company Name:'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setCommisionper(e.target.value)}
            disabled
            value={commisionper}
            fullWidth
            label='Commission Percentage (%)'
            placeholder='Commission Percentage (%)'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setCreditlimit(e.target.value)}
            disabled
            value={creditlimit}
            fullWidth
            label='Credit Limit'
            placeholder='Credit Limit'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => setEmail(e.target.value)}
            disabled
            value={email}
            fullWidth
            label='Email'
            placeholder='abc@gmail.com'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setAddress(e.target.value)}
            value={address}
            fullWidth
            label='Full Address(With Google map link):'
            placeholder='Full Address(With Google map link):'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setLendmark(e.target.value)}
            value={lendmark}
            fullWidth
            label='Landmark:'
            placeholder='Landmark:'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setPhonecode(e.target.value)}
            value={phonecode}
            fullWidth
            label='Country Code:'
            placeholder='Country Code:'
            type='number'
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            onChange={e => setTelephone(e.target.value)}
            value={telephone}
            fullWidth
            label='Contact Number:'
            placeholder='Contact Number:'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            xs={6}
            onChange={e => setDescription(e.target.value)}
            value={description}
            fullWidth
            label='Profile Description:'
            placeholder='Profile Description:'
            multiline
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variant='contained' onClick={updateProfile} sx={{ mr: 2 }}>
            Update Profile
          </Button>
        </Grid>
        <Grid item md={9} xs={12}>
          <h4>CHANGE BRAND LOGO</h4>
        </Grid>

        <Grid item md={9} xs={12}>
          <ImageList sx={{ width: 500, height: cmpLogo ? 200 : 40 }} cols={3} rowHeight={164}>
            {cmpLogo ? (
              <ImageListItem key={cmpLogo}>
                <img
                  src={`${cmpLogo}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${cmpLogo}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={cmpLogo}
                  loading='lazy'
                />
              </ImageListItem>
            ) : (
              'No Logo found!'
            )}
          </ImageList>
          <Button variant='contained' sx={{ mr: 2 }} component='label'>
            Upload Logo
            <input hidden accept='image/*' type='file' onChange={handleLogoUpload} />
          </Button>
          {uploadLogo && (
            <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
              <ImageListItem key={URL.createObjectURL(uploadLogo)}>
                <img
                  src={`${URL.createObjectURL(uploadLogo)}`}
                  srcSet={`${URL.createObjectURL(uploadLogo)}`}
                  alt={URL.createObjectURL(uploadLogo)}
                  loading='lazy'
                />
              </ImageListItem>
            </ImageList>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variant='contained' onClick={submitLogoHandler} sx={{ mr: 2 }}>
            Update Logo
          </Button>
        </Grid>
        <Grid item md={9} xs={12}>
          <h4>CHANGE PRODUCT GALLERY</h4>
        </Grid>

        <Grid item md={9} xs={12}>
          <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
            {gallery
              ? gallery.map(item => (
                  <ImageListItem key={item}>
                    <img
                      src={`${item}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item}
                      loading='lazy'
                    />

                    {gallery.length > 1 && (
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`Remove gallery item ${item}`}
                          >
                            <DeleteForeverIcon onClick={() => deleteItem(item)} />
                          </IconButton>
                        }
                      />
                    )}
                  </ImageListItem>
                ))
              : 'No gallery found!'}
          </ImageList>
          <Button variant='contained' sx={{ mr: 2 }} component='label'>
            Upload Gallery Image/s
            <input hidden accept='image/*' multiple type='file' onChange={handleGalleryUpload} />
          </Button>
          {uploadGallery.length} Files selected
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variant='contained' onClick={galleryUploadHandler} sx={{ mr: 2 }}>
            Update Gallery
          </Button>
        </Grid>
      </Grid>
      <div>
        <Dialog
          open={deleteModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Delete Gallery Item</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography>Are you sure? This action can't be undone</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={removeGallery}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Backdrop sx={{ color: '#fff', zIndex: 10000000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default Profile
