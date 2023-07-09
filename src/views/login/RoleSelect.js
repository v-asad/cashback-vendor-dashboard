//----------
//  MUI Lib
//----------
import { Typography, Box, Grid } from '@mui/material'

//----------
//  Icon
//----------
import { Icon } from '@iconify/react'

//----------
//  Local Imports
//----------
import useBgColor from 'src/@core/hooks/useBgColor'
import authConfig from 'src/configs/auth'

const RoleSelect = ({ role, setRole }) => {
  const bgColors = useBgColor()
  return (
    <Box sx={{ my: 5 }}>
      <Typography sx={{ my: 1 }}>Select Role</Typography>
      <Grid container spacing={2}>
        {authConfig.roles.map(r => {
          return (
            <Grid item xs={6}>
              <Box
                sx={{
                  py: 3,
                  px: 4,
                  borderRadius: 1,
                  cursor: 'pointer',
                  ...bgColors.primaryLight,
                  border: theme =>
                    role === r.name ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent'
                }}
                onClick={() => setRole(r.name)}
              >
                <Box sx={{ p: 0, mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon='mdi:home-outline' fontSize='large' />
                  <Typography variant='p' sx={{ color: 'primary.main' }}>
                    {r.displayName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default RoleSelect
