
import Card from '@mui/material/Card'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useAuth } from 'src/hooks/useAuth'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router'
const ViewInvoices = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  let urlString = window.location.href
  let paramString = urlString.split('?')[1];
  let queryString = new URLSearchParams(paramString);
  // const [invoiceNo, setInvoiceNo] = useState(null)
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  let invoiceNo = null;
  for (let pair of queryString.entries()) {
    if(pair[0] == 'inv'){
      invoiceNo = pair[1]
    }
  }

  const loadData = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/invoice/view/${invoiceNo}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    }).then(response=>{
      setData(response.data);
      let stotal = 0;
      let disc = 0;
      response.data.purchase_detail.map(s=>{
        stotal += parseFloat(s.net_price);
        disc += s.discount;
      })
      setDiscount(disc)
      setSubtotal(stotal)
    }).catch(error => {
      toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
      if (error.response && error.response.status == 401) {
        auth.logout();
      }
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const backToDashboard = () => {
    router.replace('/dashboard')
  }

  // For print table
  const print = () => {
    const printContent = document.getElementById('tableDiv');
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
  }
  return (
    <>
      <h1 sx={{ mb: 10 }}>SUMMARY/PAYMENT</h1>
      <h2>Purchase Invoices</h2>
      <div id="tableDiv">
        <Typography
            component='div'
            variant='p'
            sx={{ fontWeight: 'bold', mb: 5, display: 'flex', justifyContent: 'flex-end' }}
          >
            <div>
              PAID AMOUNT:
              <Card component='div' sx={{ position: 'relative', mb: 3, p: 5, minWidth: '250px' }}>
                {' '}
                {new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(data.total_amount||0)} 
              </Card>
            </div>
          </Typography>
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
                  fontWeight:'bold'
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
                <span>{data.user&&data.user.first_name}</span>
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
                <span>{data.user&&data.user.city?data.user.city+', ':''} {data.user&&data.user.state?data.user.state+', ':''} {data.user&&data.user.country?data.user.country:''}</span>
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
                <span>Tel: {data.user&&data.user.telephone}</span>
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
                  fontWeight:'bold'
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
                <span>Invoice Number: {data.invoice_no||''}</span>
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
                <span>Invoice Date: {data.payment_date&&new Date(data.payment_date).toLocaleDateString()}</span>
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
                <span><b style={{ color: 'green'}}>Stokist ID:</b> {data.seller_id&&data.seller_id}</span>
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
                <span><b style={{ color: 'green'}}>Stokist Name:</b> {data.vendor&&data.vendor.first_name?data.vendor.first_name:''} {data.vendor&&data.vendor.last_name?data.vendor.last_name:''}</span>
              </Typography>
            </Grid>
          </Grid>
      
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,mb:7 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align='center' >ITEM</TableCell>
            <TableCell align='center'>Unit Cost</TableCell>
            <TableCell align='center'>Quantity</TableCell>
            <TableCell align='center'>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.purchase_detail&&data.purchase_detail.map((pd, key)=>{
            return (
              <TableRow>
                <TableCell>{key+1}</TableCell>
                <TableCell align='center' >{pd.product_name&&pd.product_name}</TableCell>
                <TableCell align='center'>{pd.price&&pd.price.toFixed(2)}</TableCell>
                <TableCell align='center'>{pd.quantity&&pd.quantity}</TableCell>
                <TableCell align='center'>{pd.net_price&&parseInt(pd.net_price).toFixed(2)}</TableCell>
              </TableRow>
            )
          })}
            
        
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
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
                <span>{new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(data.total_amount&&data.total_amount)} </span>
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
                  fontWeight:'bold'
                }}
              >
                <span>Grand Total:</span>
                <span>{new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(subtotal&&parseInt(subtotal).toFixed(2))}</span>
              </Typography>
      
              </Card>
            </Grid>
            
          </Grid>
        </div>
        <Typography
              component='div'
              variant='p'
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pr: 20,
                p: 5,
                borderBottom: '1px solid gray',
                fontWeight:'bold',
                mt:10
              }}
            >
              <Button variant='contained' onClick={print}>Print</Button>
              <Button variant='outlined' onClick={backToDashboard}>Back to Dashboard</Button>
            </Typography>
 
    </>
  )
}

export default ViewInvoices
