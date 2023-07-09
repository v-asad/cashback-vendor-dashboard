// ** MUI Components
import { styled, useTheme, useMediaQuery } from '@mui/material'

// Styled Components
const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '7%',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '17.5%'
  }
}))

const FooterIllustrationsV2 = props => {
  // ** Props
  const { image } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const src = image || `/images/pages/auth-v2-login-mask-${theme.palette.mode}.png`
  if (!hidden) {
    return <>{image && typeof image !== 'string' ? image : <MaskImg alt='mask' src={src} />}</>
  } else {
    return null
  }
}

export default FooterIllustrationsV2
