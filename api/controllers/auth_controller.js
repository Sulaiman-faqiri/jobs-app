export const register = async (req, res, next) => {
  const body = await req.body
  const query = await req.query
  console.log(query)
  res.send('it worked')
}
export const login = (req, res, next) => {
  res.send('it worked')
}
export const logout = (req, res, next) => {
  res.send('it worked')
}
