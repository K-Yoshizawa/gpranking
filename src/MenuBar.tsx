import { NavLink } from 'react-router-dom';
import './MenuBar.css'; // メニューバー用のCSSをインポート

function MenuBar() {
  return (
    <nav className="menu-bar">
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : '')}
            end /* ルートパスに正確に一致する場合に選択状態にする */
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rule"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Rule
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rating"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Rating
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MenuBar;