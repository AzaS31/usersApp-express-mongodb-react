import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Загрузка списка пользователей
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/users', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data && Array.isArray(res.data.users)) {
                const data = res.data.users.map((u, index) => ({
                    id: u._id || `temp-${index}`,
                    firstName: u.firstName || '—',
                    secondName: u.secondName || '—',
                    age: Number(u.age) || 0,
                    city: u.city || '—',
                    email: u.email || '—',
                }));

                setRows(data);
            } else {
                console.error('Некорректный формат ответа:', res.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Удалить пользователя
    const handleDelete = async (id) => {
        if (window.confirm('Удалить этого пользователя?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Обновляем список после удаления
                fetchData();
            } catch (error) {
                console.error('Ошибка удаления:', error);
            }
        }
    };

    // Навигация на страницу редактирования
    const handleEdit = (id) => {
        navigate(`/users/edit/${id}`);
    };

    // Навигация на страницу добавления
    const handleAdd = () => {
        navigate('/users/add');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'firstName', headerName: 'Имя', width: 130 },
        { field: 'secondName', headerName: 'Фамилия', width: 130 },
        { field: 'age', headerName: 'Возраст', type: 'number', width: 90 },
        { field: 'city', headerName: 'Город', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 200,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ height: '100%', alignItems: 'center' }} 
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row.id)}
                    >
                        Изменить
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Удалить
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <Paper sx={{ height: 600, boxShadow: 3, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Список пользователей</Typography>
                <Button variant="contained" color="primary" onClick={handleAdd}>
                    Добавить пользователя
                </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
                <DataGrid
                    loading={loading}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Box>
        </Paper>
    );
}

