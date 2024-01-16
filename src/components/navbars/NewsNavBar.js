import styles from "./NewsNavBar.module.css";
import { NavLink } from "react-router-dom";

const NewsNavBar = () => {
  return (
    <header className={styles.navbar}>
      <nav>
        <NavLink
          to="/news"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          News
        </NavLink>
        <NavLink
          to="/avatars"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          Avatars
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

export default NewsNavBar;
