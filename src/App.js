import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Box,
  Divider,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { generateCompletion } from './services/openai';

export default function App() {
  const theme = useTheme();
  // Initial states with default values
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a professional product description writer. Your task is to create compelling, detailed, and accurate product descriptions that highlight the key features and benefits of the product. Focus on creating engaging content that helps potential customers understand the product's value proposition."
  );
  const [userPrompt, setUserPrompt] = useState(
    "Write a detailed product description for the latest iPhone model, highlighting its key features, specifications, and benefits. Make it engaging and informative for potential customers."
  );
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stopSequence, setStopSequence] = useState("");

  // Parameter selection states
  const [selectedParams, setSelectedParams] = useState({
    temperature: false,
    maxTokens: false,
    presencePenalty: false,
    frequencyPenalty: false,
    stopSequence: false
  });

  // Parameter values
  const [paramValues, setParamValues] = useState({
    temperature: 0.7,
    maxTokens: 150,
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
    stopSequence: ""
  });

  // Default test values
  const defaultValues = {
    temperature: [0.0, 0.7, 1.2],
    maxTokens: [50, 150, 300],
    presencePenalty: [0.0, 1.5],
    frequencyPenalty: [0.0, 1.5]
  };

  const handleParamSelection = (param) => {
    setSelectedParams(prev => ({
      ...prev,
      [param]: !prev[param]
    }));
  };

  const handleParamValueChange = (param, value) => {
    setParamValues(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const generateCombinations = async () => {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      alert('Please set your OpenAI API key in the .env file');
      return;
    }

    setLoading(true);
    setResults([]);
    
    // Get the values to use for each parameter
    const getParamValues = (param) => {
      if (selectedParams[param]) {
        return [paramValues[param]]; // Use selected value
      }
      return defaultValues[param]; // Use all default values
    };

    // Generate all combinations
    const tempValues = getParamValues('temperature');
    const maxTokensValues = getParamValues('maxTokens');
    const presencePenaltyValues = getParamValues('presencePenalty');
    const frequencyPenaltyValues = getParamValues('frequencyPenalty');
    const stopSequenceValue = selectedParams.stopSequence ? paramValues.stopSequence : "";

    for (const temp of tempValues) {
      for (const maxTokens of maxTokensValues) {
        for (const presencePenalty of presencePenaltyValues) {
          for (const frequencyPenalty of frequencyPenaltyValues) {
            try {
              const result = await generateCompletion({
                model,
                systemPrompt,
                userPrompt,
                temperature: temp,
                max_tokens: maxTokens,
                presence_penalty: presencePenalty,
                frequency_penalty: frequencyPenalty,
                stop: stopSequenceValue || undefined
              });

              setResults(prevResults => [...prevResults, {
                temperature: temp,
                max_tokens: maxTokens,
                presence_penalty: presencePenalty,
                frequency_penalty: frequencyPenalty,
                stop_sequence: stopSequenceValue || "None",
                result,
              }]);
            } catch (error) {
              setResults(prevResults => [...prevResults, {
                temperature: temp,
                max_tokens: maxTokens,
                presence_penalty: presencePenalty,
                frequency_penalty: frequencyPenalty,
                stop_sequence: stopSequenceValue || "None",
                result: `Error: ${error.message}`,
              }]);
            }
          }
        }
      }
    }

    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[100],
      py: 4
    }}>
      <Container maxWidth="lg">
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 3
              }}
            >
              Interactive Prompt Playground
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Model</InputLabel>
                        <Select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          sx={{ 
                            backgroundColor: 'white',
                            '&:hover': {
                              backgroundColor: theme.palette.grey[50]
                            }
                          }}
                        >
                          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                          <MenuItem value="gpt-4">GPT-4</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="System Prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        sx={{ 
                          backgroundColor: 'white',
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="User Prompt"
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        sx={{ 
                          backgroundColor: 'white',
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 'medium'
                        }}
                      >
                        Parameter Selection
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Temperature */}
                        <Grid item xs={12} md={6}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.grey[50]
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedParams.temperature}
                                  onChange={() => handleParamSelection('temperature')}
                                  color="primary"
                                />
                              }
                              label="Fix Temperature"
                            />
                            {selectedParams.temperature && (
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel>Temperature</InputLabel>
                                <Select
                                  value={paramValues.temperature}
                                  onChange={(e) => handleParamValueChange('temperature', e.target.value)}
                                  sx={{ backgroundColor: 'white' }}
                                >
                                  {defaultValues.temperature.map(value => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Card>
                        </Grid>

                        {/* Max Tokens */}
                        <Grid item xs={12} md={6}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.grey[50]
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedParams.maxTokens}
                                  onChange={() => handleParamSelection('maxTokens')}
                                  color="primary"
                                />
                              }
                              label="Fix Max Tokens"
                            />
                            {selectedParams.maxTokens && (
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel>Max Tokens</InputLabel>
                                <Select
                                  value={paramValues.maxTokens}
                                  onChange={(e) => handleParamValueChange('maxTokens', e.target.value)}
                                  sx={{ backgroundColor: 'white' }}
                                >
                                  {defaultValues.maxTokens.map(value => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Card>
                        </Grid>

                        {/* Presence Penalty */}
                        <Grid item xs={12} md={6}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.grey[50]
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedParams.presencePenalty}
                                  onChange={() => handleParamSelection('presencePenalty')}
                                  color="primary"
                                />
                              }
                              label="Fix Presence Penalty"
                            />
                            {selectedParams.presencePenalty && (
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel>Presence Penalty</InputLabel>
                                <Select
                                  value={paramValues.presencePenalty}
                                  onChange={(e) => handleParamValueChange('presencePenalty', e.target.value)}
                                  sx={{ backgroundColor: 'white' }}
                                >
                                  {defaultValues.presencePenalty.map(value => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Card>
                        </Grid>

                        {/* Frequency Penalty */}
                        <Grid item xs={12} md={6}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.grey[50]
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedParams.frequencyPenalty}
                                  onChange={() => handleParamSelection('frequencyPenalty')}
                                  color="primary"
                                />
                              }
                              label="Fix Frequency Penalty"
                            />
                            {selectedParams.frequencyPenalty && (
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel>Frequency Penalty</InputLabel>
                                <Select
                                  value={paramValues.frequencyPenalty}
                                  onChange={(e) => handleParamValueChange('frequencyPenalty', e.target.value)}
                                  sx={{ backgroundColor: 'white' }}
                                >
                                  {defaultValues.frequencyPenalty.map(value => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Card>
                        </Grid>

                        {/* Stop Sequence */}
                        <Grid item xs={12} md={6}>
                          <Card 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.grey[50]
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedParams.stopSequence}
                                  onChange={() => handleParamSelection('stopSequence')}
                                  color="primary"
                                />
                              }
                              label="Fix Stop Sequence"
                            />
                            {selectedParams.stopSequence && (
                              <TextField
                                fullWidth
                                label="Stop Sequence"
                                value={paramValues.stopSequence}
                                onChange={(e) => handleParamValueChange('stopSequence', e.target.value)}
                                placeholder="Enter stop sequence (e.g., '###' or 'END')"
                                sx={{ mt: 1, backgroundColor: 'white' }}
                                helperText="The model will stop generating when it encounters this sequence"
                              />
                            )}
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={generateCombinations}
                        disabled={loading}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          fontSize: '1.1rem',
                          textTransform: 'none',
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4
                          }
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={24} color="inherit" />
                            <Typography>Generating Results...</Typography>
                          </Box>
                        ) : (
                          'Generate Combinations'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 'medium',
                mb: 2
              }}
            >
              Results
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Temperature</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Max Tokens</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Presence Penalty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Frequency Penalty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stop Sequence</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: theme.palette.grey[50] 
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.grey[100]
                        }
                      }}
                    >
                      <TableCell>{result.temperature}</TableCell>
                      <TableCell>{result.max_tokens}</TableCell>
                      <TableCell>{result.presence_penalty}</TableCell>
                      <TableCell>{result.frequency_penalty}</TableCell>
                      <TableCell>{result.stop_sequence}</TableCell>
                      <TableCell sx={{ 
                        maxWidth: '400px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {result.result}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
