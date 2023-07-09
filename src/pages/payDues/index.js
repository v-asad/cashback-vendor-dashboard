//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
//  Next Imports
//----------
import { useRouter } from 'next/router'

//----------
//  MUI Lib
//----------
import { Card, Typography, Grid, TextField, Button, ImageList, ImageListItem } from '@mui/material'

//----------
//  Other Library Imports
//----------
import axios from 'axios'
import { toast } from 'react-hot-toast'

const PayDues = () => {
  const router = useRouter()

  //----------
  //  States
  //----------
  const [paymentMode, setPaymentMode] = useState(null)
  const [amount, setAmount] = useState(0)
  const [uploadProof, setUploadProof] = useState(null)
  const [dueAmount, setDueAmount] = useState(0)
  useEffect(() => {
    // Function to load data
    const loadData = () => {
      // Send a GET request to fetch franchise panel data
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          // Set the dueAmount state with the response data
          setDueAmount(response.data.dueAmount)
        })
        .catch(error => {
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

    // Load data when the component mounts
    loadData()
  }, [])

  const handleProofUpload = event => {
    const selectedImage = event.target.files[0]
    setUploadProof(selectedImage)
  }

  const submitHandler = () => {
    let errors = 0

    // Validate the form fields
    if (!amount) {
      toast.error('Amount must be greater than 0')
      errors++
    }
    if (!paymentMode) {
      toast.error('Payment Method is required')
      errors++
    }
    if (!uploadProof) {
      toast.error('Upload Proof is required')
      errors++
    }

    // Proceed with submission if there are no errors
    if (!errors) {
      // Send a POST request to pay dues
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/pay-dues`,
          { payment_mode: paymentMode, amount: amount },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(resp => {
          // Upload Proof
          let data = resp.data
          let id = data.id
          if (data.success) {
            // Show success toast message
            toast.success(data.message)
            toast.success('Please wait we are uploading proof!')

            // Create a new FormData object to store the payment proof file
            const formData = new FormData()
            formData.append('payment_proof', uploadProof)

            // Send a PUT request to upload the payment proof
            axios
              .put(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/pay-dues/${id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.accessToken}`
                }
              })
              .then(response => {
                // Redirect to the due request page
                router.replace('/due-request')
              })
          } else {
            // Show error toast message
            toast.error(data.message)
          }
        })
        .catch(error => {
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
  }

  return (
    <>
      <h2>PAY DUES</h2>
      <Card component='div' sx={{ position: 'relative', mb: 7, p: 7 }}>
        {/* DUE AMOUNT */}
        <Typography
          component='div'
          variant='p'
          sx={{ fontWeight: 'bold', mb: 10, display: 'flex', justifyContent: 'space-between' }}
        >
          DUE AMOUNT :{' '}
          {new Intl.NumberFormat(`${localStorage.localization}`, {
            style: 'currency',
            currency: process.env.NEXT_PUBLIC_CURRENCY
          }).format(dueAmount)}
        </Typography>

        {/* Bank Details */}
        <Grid container spacing={2} className='match-height'>
          <Grid item xs={12} md={6}>
            <h3>Bank Details: </h3>
            <Typography
              component='div'
              variant='p'
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pr: 20,
                p: 5,
                borderBottom: '1px solid gray'
              }}
            >
              <span>Bank Name :</span>
              <span>HDFC</span>
            </Typography>
            <Typography
              component='div'
              variant='p'
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pr: 20,
                p: 5,
                borderBottom: '1px solid gray'
              }}
            >
              <span>IFSC CODE:</span>
              <span>HDFC0000115</span>
            </Typography>
            <Typography
              component='div'
              variant='p'
              sx={{
                mb: 10,
                display: 'flex',
                justifyContent: 'space-between',
                pr: 20,
                p: 5,
                borderBottom: '1px solid gray'
              }}
            >
              <span>AC No:</span>
              <span>50200058944662</span>
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Payment Mode Input */}
            <Grid item xs={12} sx={{ m: 5 }}>
              <TextField
                xs={12}
                fullWidth
                label='Payment Mode'
                placeholder='Payment Mode'
                onChange={e => setPaymentMode(e.target.value)}
                value={paymentMode}
              />
            </Grid>

            {/* Amount Input */}
            <Grid item xs={12} sx={{ m: 5 }}>
              <TextField
                xs={12}
                fullWidth
                label='Amount:'
                placeholder='Amount:'
                onChange={e => setAmount(e.target.value)}
                value={amount}
              />
            </Grid>

            {/* Upload Proof Button */}
            <Grid item xs={12} sx={{ m: 5 }}>
              <Button variant='contained' sx={{ mr: 2 }} component='label'>
                Upload Proof
                <input hidden accept='image/*' type='file' onChange={handleProofUpload} />
              </Button>
              {/* Display uploaded proof image */}
              {uploadProof && (
                <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                  <ImageListItem key={URL.createObjectURL(uploadProof)}>
                    <img
                      src={`${URL.createObjectURL(uploadProof)}`}
                      srcSet={`${URL.createObjectURL(uploadProof)}`}
                      alt={URL.createObjectURL(uploadProof)}
                      loading='lazy'
                    />
                  </ImageListItem>
                </ImageList>
              )}
            </Grid>

            {/* Update Button */}
            <Grid item xs={12} sx={{ m: 5 }}>
              <Button variant='contained' sx={{ mr: 2 }} component='label' onClick={submitHandler}>
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default PayDues
