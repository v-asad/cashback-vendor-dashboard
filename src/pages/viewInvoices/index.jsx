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
import {
  Card,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material/Card'

//----------
//  Other Library Imports
//----------
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ViewInvoices = () => {
  // Router instance from Next.js
  const router = useRouter()

  // Get the invoice number from the URL query string
  let urlString = window.location.href
  let paramString = urlString.split('?')[1]
  let queryString = new URLSearchParams(paramString)
  let invoiceNo = null
  for (let pair of queryString.entries()) {
    if (pair[0] == 'inv') {
      invoiceNo = pair[1]
    }
  }

  //----------
  // States
  //----------
  const [data, setData] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/invoice/view/${invoiceNo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          setData(response.data)
          let stotal = 0
          let disc = 0
          response.data.purchase_detail.map(s => {
            stotal += parseFloat(s.net_price)
            disc += s.discount
          })
          setSubtotal(stotal)
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

  // Function to navigate back to the dashboard
  const backToDashboard = () => {
    router.replace('/dashboard')
  }

  // Function to print the table
  const print = () => {
    const printContent = document.getElementById('tableDiv')
    const originalContent = document.body.innerHTML
    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
  }

  return (
    <>
      {/* Heading */}
      <h1 sx={{ mb: 10 }}>SUMMARY/PAYMENT</h1>
      <h2>Purchase Invoices</h2>

      {/* Table */}
      <div id='tableDiv'>
        <Typography
          component='div'
          variant='p'
          sx={{ fontWeight: 'bold', mb: 5, display: 'flex', justifyContent: 'flex-end' }}
        >
          <div>
            PAID AMOUNT:
            <Card component='div' sx={{ position: 'relative', mb: 3, p: 5, minWidth: '250px' }}>
              {' '}
              {new Intl.NumberFormat(`${localStorage.localization}`, {
                style: 'currency',
                currency: process.env.NEXT_PUBLIC_CURRENCY
              }).format(data.total_amount || 0)}
            </Card>
          </div>
        </Typography>

        {/* Invoice details */}
        <Card component='div' sx={{ position: 'relative', mb: 10, p: 7 }}>
          <Grid container spacing={2} className='match-height'>
            <Grid item xs={12} md={6}>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20,
                  fontWeight: 'bold'
                }}
              >
                <span>To</span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>{data.user && data.user.first_name}</span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>
                  {data.user && data.user.city ? data.user.city + ', ' : ''}{' '}
                  {data.user && data.user.state ? data.user.state + ', ' : ''}{' '}
                  {data.user && data.user.country ? data.user.country : ''}
                </span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>Tel: {data.user && data.user.telephone}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20,
                  fontWeight: 'bold'
                }}
              >
                <span>Invoice Info</span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>Invoice Number: {data.invoice_no || ''}</span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>Invoice Date: {data.payment_date && new Date(data.payment_date).toLocaleDateString()}</span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>
                  <b style={{ color: 'green' }}>Stokist ID:</b> {data.seller_id && data.seller_id}
                </span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20
                }}
              >
                <span>
                  <b style={{ color: 'green' }}>Stokist Name:</b>{' '}
                  {data.vendor && data.vendor.first_name ? data.vendor.first_name : ''}{' '}
                  {data.vendor && data.vendor.last_name ? data.vendor.last_name : ''}
                </span>
              </Typography>
            </Grid>
          </Grid>

          {/* Purchase details table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, mb: 7 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align='center'>ITEM</TableCell>
                  <TableCell align='center'>Unit Cost</TableCell>
                  <TableCell align='center'>Quantity</TableCell>
                  <TableCell align='center'>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.purchase_detail &&
                  data.purchase_detail.map((pd, key) => {
                    return (
                      <TableRow>
                        <TableCell>{key + 1}</TableCell>
                        <TableCell align='center'>{pd.product_name && pd.product_name}</TableCell>
                        <TableCell align='center'>{pd.price && pd.price.toFixed(2)}</TableCell>
                        <TableCell align='center'>{pd.quantity && pd.quantity}</TableCell>
                        <TableCell align='center'>{pd.net_price && parseInt(pd.net_price).toFixed(2)}</TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Payment status and subtotal */}
        <Grid container spacing={2} className='match-height'>
          <Grid item xs={12} md={6}>
            Payment Status: PAID
          </Grid>
          <Grid item xs={12} md={6}>
            <Card component='div' sx={{ position: 'relative', mb: 7 }}>
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
                <span>SubTotal:</span>
                <span>
                  {new Intl.NumberFormat(`${localStorage.localization}`, {
                    style: 'currency',
                    currency: process.env.NEXT_PUBLIC_CURRENCY
                  }).format(data.total_amount && data.total_amount)}{' '}
                </span>
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 20,
                  p: 5,
                  borderBottom: '1px solid gray',
                  fontWeight: 'bold'
                }}
              >
                <span>Grand Total:</span>
                <span>
                  {new Intl.NumberFormat(`${localStorage.localization}`, {
                    style: 'currency',
                    currency: process.env.NEXT_PUBLIC_CURRENCY
                  }).format(subtotal && parseInt(subtotal).toFixed(2))}
                </span>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Buttons for printing and going back */}
      <Typography
        component='div'
        variant='p'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pr: 20,
          p: 5,
          borderBottom: '1px solid gray',
          fontWeight: 'bold',
          mt: 10
        }}
      >
        <Button variant='contained' onClick={print}>
          Print
        </Button>
        <Button variant='outlined' onClick={backToDashboard}>
          Back to Dashboard
        </Button>
      </Typography>
    </>
  )
}

export default ViewInvoices
