export default {
  meEndpoint: '/auth/me',
  roles: [
    { name: 'client', displayName: 'Admin', loginEndpoint: 'clients/login', homepage: '/dashboard' },
    { name: 'teacher', displayName: 'Teacher', loginEndpoint: 'teachers/loginByEmail', homepage: '/teacher-dashboard' }
  ],
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  storageAliasTokenKeyName: 'aliasToken',
  onTokenExpiration: 'refreshToken',
  clientRole: {
    name: 'client',
    displayName: 'Admin',
    loginEndpoint: 'clients/login',
    homepage: '/dashboard'
  }
}
