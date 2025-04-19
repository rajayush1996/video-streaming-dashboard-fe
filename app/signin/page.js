"use client";

import { useState } from 'react';
import {
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button,
  Paper,
  Stack, 
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { useLogin, useSignUp } from '@/hooks/useAuth';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    identifier: '',
    password: '',
    isEmail: false,
  });
  const [errors, setErrors] = useState({
    name: '',
    identifier: '',
    password: '',
  });

  const loginMutation = useLogin();
  const signUpMutation = useSignUp();

  const validateField = (field, value) => {
    if (field === 'identifier') {
      if (!value.trim()) {
        return 'Username or Email is required';
      }
      if (value.includes('@')) {
        if (!/\S+@\S+\.\S+/.test(value)) {
          return 'Invalid email format';
        }
      } else {
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
      }
    } else if (field === 'password') {
      if (!value) {
        return 'Password is required';
      }
      if (value.length < 6) {
        return 'Password must be at least 6 characters';
      }
    } else if (field === 'name' && isSignUp) {
      if (!value.trim()) {
        return 'Name is required';
      }
    }
    return '';
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    if (field === 'identifier') {
      const isEmail = value.includes('@');
      setForm({ ...form, [field]: value, isEmail });
    } else {
      setForm({ ...form, [field]: value });
    }

    // Live validation
    const fieldError = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate identifier
    const identifierError = validateField('identifier', form.identifier);
    if (identifierError) {
      newErrors.identifier = identifierError;
    }
    
    // Validate password
    const passwordError = validateField('password', form.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    // Additional validation for sign up
    if (isSignUp) {
      const nameError = validateField('name', form.name);
      if (nameError) {
        newErrors.name = nameError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const requestData = {
      identifier: form.identifier.trim(),
      password: form.password,
      ...(isSignUp && { name: form.name.trim() }),
    };

    if (isSignUp) {
      signUpMutation.mutate(requestData);
    } else {
      loginMutation.mutate(requestData);
    }
  };

  const isLoading = loginMutation.isPending || signUpMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          className="p-8 md:p-10 rounded-xl bg-white/10 backdrop-blur-lg"
          sx={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack spacing={4}>
            <Box className="text-center">
              <Typography
                variant="h4"
                component="h1"
                className="text-white font-bold mb-2"
              >
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-300"
              >
                {isSignUp 
                  ? 'Sign up to start streaming your favorite content'
                  : 'Sign in to continue where you left off'}
              </Typography>
            </Box>

            <Box 
              component="form" 
              onSubmit={handleFormSubmit}
              noValidate
              sx={{ width: '100%' }}
            >
              <Stack spacing={3}>
                {isSignUp && (
                  <TextField
                    fullWidth
                label="Name"
                    value={form.name}
                    onChange={handleChange('name')}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                    className="bg-white/5 backdrop-blur-sm"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person className="text-white" />
                        </InputAdornment>
                      ),
                      sx: {
                        height: '56px',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white',
                        },
                      },
                    }}
                    InputLabelProps={{
                      className: 'text-white',
                      sx: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Username or Email"
                  type={form.isEmail ? "email" : "text"}
                  value={form.identifier}
                  onChange={handleChange('identifier')}
                  required
                  error={!!errors.identifier}
                  helperText={errors.identifier || "Sign in with your username or email address"}
                  variant="outlined"
                  className="bg-white/5 backdrop-blur-sm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {form.isEmail ? <Email className="text-white" /> : <Person className="text-white" />}
                      </InputAdornment>
                    ),
                    sx: {
                      height: '56px',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    },
                  }}
                  InputLabelProps={{
                    className: 'text-white',
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                  placeholder="e.g., john_doe or john@example.com"
                />

                <TextField
                  fullWidth
              label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  className="bg-white/5 backdrop-blur-sm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-white" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      height: '56px',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    },
                  }}
                  InputLabelProps={{
                    className: 'text-white',
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    height: '56px',
                    backgroundColor: 'rgba(59, 130, 246, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 1)',
                    },
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
            </Button>

                <Box className="text-center mt-4">
                  <Typography
                    variant="body2"
                    className="text-gray-300"
                  >
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setErrors({});
                        setForm({
                          identifier: '',
                          password: '',
                          name: '',
                          isEmail: false,
                        });
                      }}
                      className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
          </Paper>
    </Container>
    </div>
  );
};

export default AuthPage;
