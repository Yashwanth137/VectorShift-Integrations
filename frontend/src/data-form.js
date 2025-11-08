import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
  Notion: 'notion',
  Airtable: 'airtable',
  HubSpot: 'hubspot',
};

export const DataForm = ({ integrationType, credentials }) => {
  const [loadedData, setLoadedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const endpoint = endpointMapping[integrationType];

  const handleLoad = async () => {
    if (!endpoint) {
      alert('Invalid integration type.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('credentials', JSON.stringify(credentials));

      const response = await axios.post(
        `http://localhost:8000/integrations/${endpoint}/load`,
        formData
      );

      setLoadedData(response.data);
      console.log("Integration Items:", response.data);

    } catch (e) {
      console.error('Error loading data:', e);
      alert(e?.response?.data?.detail || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setLoadedData(null);

  // Helper to detect array of objects
  const isArrayOfObjects = (data) =>
    Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        {integrationType ? `${integrationType} Data` : 'Integration Data'}
      </Typography>

      <Box display="flex" flexDirection="column" width="100%" maxWidth={800}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : loadedData && isArrayOfObjects(loadedData) ? (
          <Paper elevation={2} sx={{ mt: 2, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(loadedData[0]).map((key) => (
                    <TableCell
                      key={key}
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    >
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loadedData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.keys(row).map((key) => (
                      <TableCell key={key}>
                        {row[key] === null || row[key] === undefined ? (
                          ''
                        ) : typeof row[key] === 'object' ? (
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(row[key], null, 2)}
                          </pre>
                        ) : (
                          String(row[key])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <TextField
            label="Loaded Data"
            value={loadedData ? JSON.stringify(loadedData, null, 2) : ''}
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={10}
            fullWidth
            disabled
          />
        )}

        <Box display="flex" gap={2} sx={{ mt: 3 }}>
          <Button
            onClick={handleLoad}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Data'}
          </Button>

          <Button
            onClick={handleClear}
            variant="outlined"
            color="secondary"
            disabled={loading || !loadedData}
          >
            Clear Data
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
