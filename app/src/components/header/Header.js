import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

class Header extends Component {
  render() {
    return(
      <nav className="w-75 m-auto">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarExample01"
            aria-controls="navbarExample01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarExample01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item active">
                <NavLink className="nav-link" aria-current="page" to="/">News</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/archived-articles">Archived</NavLink>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="#">Logout</a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;