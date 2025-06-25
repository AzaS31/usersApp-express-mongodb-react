import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material'; // ✅ Импортируем MUI-кнопку

export default function EditUserPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    age: '',
    city: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.user) {
          const u = res.data.user;
          setFormData({
            firstName: u.firstName || '',
            secondName: u.secondName || '',
            age: u.age ? String(u.age) : '',
            city: u.city || '',
            email: u.email || '',
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userData = {
        firstName: formData.firstName,
        secondName: formData.secondName,
        age: Number(formData.age) || 0,
        city: formData.city,
        email: formData.email,
      };

      if (isEditing) {
        await axios.put(`http://localhost:3000/users/${id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:3000/users`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate('/users');
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 16, border: '1px solid #ccc', borderRadius: 4 }}>
      <h2>{isEditing ? 'Редактировать пользователя' : 'Добавить нового пользователя'}</h2>

      <form onSubmit={handleSubmit}>
        {['firstName', 'secondName', 'age', 'city', 'email'].map((field) => (
          <div key={field} style={{ marginBottom: 12 }}>
            <label>
              {field === 'firstName' ? 'Имя' :
               field === 'secondName' ? 'Фамилия' :
               field === 'age' ? 'Возраст' :
               field === 'city' ? 'Город' : 'Email'}
              <input
                type={field === 'age' ? 'number' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={loading}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
                min={field === 'age' ? 0 : undefined}
              />
            </label>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Отмена
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </div>
  );
}
