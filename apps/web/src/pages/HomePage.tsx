import { Typography, Card, CardContent, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const HomePage = () => {
  const { data: healthStatus, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get('/api/healthz')
      return response.data
    },
  })

  return (
    <Box className="text-center">
      <Typography variant="h2" component="h1" gutterBottom>
        Hello PetShop
      </Typography>

      <Card sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Status
          </Typography>
          {isLoading ? (
            <Typography color="text.secondary">Checking...</Typography>
          ) : healthStatus ? (
            <Typography color="success.main">
              ✅ Connected: {healthStatus.status}
            </Typography>
          ) : (
            <Typography color="error.main">❌ API not available</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default HomePage
