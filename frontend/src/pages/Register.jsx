import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    secondName: '',
    age: '',
    city: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/auth/register', form);
      setIsSuccess(true);
      setMessage('Успешная регистрация! ID: ' + res.data.id);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.error || 'Ошибка регистрации');
    }
  };

  return (
    <Box
      maxWidth={500}
      margin="40px auto"
      padding={4}
      border="1px solid #ccc"
      borderRadius={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h5" mb={2}>
        Регистрация
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="100%">
        <TextField
          label="Имя"
          name="firstName"
          fullWidth
          margin="normal"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Фамилия"
          name="secondName"
          fullWidth
          margin="normal"
          value={form.secondName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Возраст"
          name="age"
          type="number"
          fullWidth
          margin="normal"
          value={form.age}
          onChange={handleChange}
          required
        />
        <TextField
          label="Город"
          name="city"
          fullWidth
          margin="normal"
          value={form.city}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </Box>

      {message && (
        <Alert severity={isSuccess ? 'success' : 'error'} sx={{ mt: 2, width: '100%' }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
