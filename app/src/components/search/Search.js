import React from 'react';
import { useParams } from "react-router-dom";
// importando modulos de las paginas
// import Slider from './Slider';
// import Sidebar from './Sidebar';
import Articles from '../articles/Articles';

function Search() {
  const { search } = useParams();
  var title = "Results for " + search;
  return (

    <Articles title={title} search={search} />
  );
}
 
export default Search;