const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.administrator.token,
  avatar: state => state.administrator.avatar,
  name: state => state.administrator.name,
  roles: state => state.administrator.roles,
  userId: state => state.user.userId
}
export default getters
