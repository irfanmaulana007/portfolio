import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth';

export function Layout() {
  const { email, logout } = useAuth();
  return (
    <>
      <div className="topbar">
        <div className="row">
          <strong>Portfolio Admin</strong>
          <nav className="nav">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/contacts">Contacts</NavLink>
          </nav>
        </div>
        <div className="row">
          <span className="muted">{email}</span>
          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
