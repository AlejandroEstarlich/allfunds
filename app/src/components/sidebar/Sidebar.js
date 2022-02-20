import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  let navigate = useNavigate();
  const searchArticle = event => {
    event.preventDefault();
    const name = document.querySelector('#searchParam').value;
    
    if(name) {
      navigate('/search/'+name);
    }
  }

  return (
    <aside className="sidebar bg-dark text-center text-white py-5 px-2 d-flex flex-column justify-content-center align-items-center">
      <div className='sidebar-title'>
        <NavLink to="/new-article" className='btn btn-success'>Create article</NavLink>
      </div>

      <div className='pt-5'>
        <h3>Searcher</h3>
        <p>Find an article</p>
        <form className="input-group justify-content-center" onSubmit={searchArticle}>
          <div className="form-outline">
            <input type="search" id="searchParam" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>
    </aside>
  );
}