require('dotenv').config()
require('./db')
const { createApp } = require('./app')

const app = createApp()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
