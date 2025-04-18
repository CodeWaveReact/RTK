import { NavLink, useNavigate } from "react-router-dom";
import { removeLocalStorage } from "../utils/auth";

export const Header = () => {
  const navigate = useNavigate();
  
  const logout = () => {
    removeLocalStorage("access_token");
    navigate("/login");
  };
  
  return (
    <header>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ul>
          <li>
            <NavLink to="/">
              <h4>Home</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/crud">
              <h4>Crud</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/infinite-scroll">
              <h4>Infinite Scroll</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/button-click-get-data">
              <h4>Button Click Get Data</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/single-pagination">
              <h4>Single Pagination</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dynamic-paginate">
              <h4>Dynamic Paginate</h4>
            </NavLink>
          </li>
        </ul>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </header>
  );
};
