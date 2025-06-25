import { Link, useLocation } from 'react-router-dom';

export default function Header({ token, logout }) {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Главная
        </Link>

        {token && (
          <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
            Пользователи
          </Link>
        )}

        {!token && (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
              Вход
            </Link>
            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
              Регистрация
            </Link>
          </>
        )}

        {token && (
          <button className="logout-btn" onClick={logout}>
            Выйти
          </button>
        )}
      </nav>
    </header>
  );
}
