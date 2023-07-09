import adminRoutes from './admin.routes'
import clientRoutes from './client.routes'

const getRoutes = (role = '') => {
  switch (role.toLowerCase()) {
    case 'admin':
      return adminRoutes
    case 'client':
      return clientRoutes
    default:
      return []
  }
}

export default getRoutes
