//----------
//  React Imports
//----------
import { useState } from 'react'

//----------
//  MUI Lib
//----------
import {
  Button,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  useMediaQuery,
  OutlinedInput,
  styled,
  useTheme,
  FormHelperText,
  InputAdornment,
  Typography,
  Card,
  Divider
} from '@mui/material'

//----------
//  Icon Imports
//----------
import Icon from 'src/@core/components/icon'

//----------
//  Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'

//----------
//  Other Library Imports
//----------
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import Box from '@mui/material/Box'
//----------
//  Styled Components
//----------
const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

//----------
//  Constants
//----------
const defaultValues = {
  password: '',
  email: ''
}
const role = null

const LoginPage = () => {
  //----------
  //  Hooks
  //----------
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  //----------
  //  States
  //----------
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const { skin } = settings

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    setSubmitting(true)

    // Extract email and password from form data
    const { email, password } = data

    // Call the login function with email, password, and role
    auth.login({ email, password, role }, ({ success, message }) => {
      setSubmitting(false)

      // Display success toast if login was successful
      if (success) {
        toast.success('Logged In')
      } else {
        // Display error toast for each error message
        message.map(msg => toast.error(msg))
      }
    })
  }

  return (
    <Box sx={{ overflow: 'auto' }} className='content-center cloudbg'>
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Card
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            {/* Logo */}
            <Box sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 6
                }}
              >
                <img src='/images/logo.png' style={{ width: 150, objectFit: 'cover' }} />
              </Box>
              <TypographyStyled variant='h5'>{`Welcome to Vendor Dashboard`}</TypographyStyled>
              <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
            </Box>

            {/* Login Form */}
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Divider />

              {/* Email Input */}
              <FormControl fullWidth sx={{ my: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='example@example.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>

              {/* Password Input */}
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Login Button */}
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ my: 7 }} disabled={isSubmitting}>
                Login
              </Button>
            </form>
          </BoxWrapper>
        </Card>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
