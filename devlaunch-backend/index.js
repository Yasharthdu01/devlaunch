const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');

const authRoutes = require('./routes/auth') 
const wizardRoutes = require('./routes/wizard')
const aiRoutes     = require('./routes/ai')
const chatRoutes     = require('./routes/chat')
const proposalRoutes = require('./routes/proposals')
const projectRoutes    = require('./routes/projects')
const milestoneRoutes  = require('./routes/milestones')
const taskRoutes      = require('./routes/tasks')
const adminRoutes     = require('./routes/admin')
const marketingRoutes = require('./routes/marketing')
const supportRoutes   = require('./routes/support')

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DevLaunch API running ✅' })
})

// Projects route (dummy data for now)
app.get('/api/projects', (req, res) => {
  res.json([
    { id: 1, title: 'TravelNest portal',   status: 'delivered', value: 420000 },
    { id: 2, title: 'RoamApp mobile app',  status: 'delivered', value: 280000 },
    { id: 3, title: 'MediBook healthcare', status: 'live',      value: 510000 },
    { id: 4, title: 'ShopX e-commerce',   status: 'live',      value: 650000 },
  ])
})

// Reviews route (dummy data for now)
app.get('/api/reviews', (req, res) => {
  res.json([
    { id: 1, name: 'Rajesh Kumar',  rating: 5, company: 'TravelNest' },
    { id: 2, name: 'Ananya Sharma', rating: 5, company: 'EdQuest' },
    { id: 3, name: 'Mohammed Viqar', rating: 4, company: 'ShopX' },
  ])
})

app.use('/api/auth', authRoutes)
app.use('/api/wizard', wizardRoutes)
app.use('/api/ai',     aiRoutes)
app.use('/api/chat',      chatRoutes)
app.use('/api/proposals', proposalRoutes)
app.use('/api/projects',   projectRoutes)
app.use('/api/milestones', milestoneRoutes)
app.use('/api/tasks',      taskRoutes)
app.use('/api/admin',      adminRoutes)
app.use('/api/marketing',  marketingRoutes)
app.use('/api/support',    supportRoutes)

app.listen(5000, () => {
  console.log('Server running on port 5000 ✅')
})