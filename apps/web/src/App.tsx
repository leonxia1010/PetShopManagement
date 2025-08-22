import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  )
}

export default App
