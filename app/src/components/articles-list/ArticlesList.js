import React, { useState, useEffect } from 'react';
import Title from '../title/Title';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from '../../Global';
import { Link, useParams } from 'react-router-dom';
import './ArticlesList.scss';
import Sidebar from '../sidebar/Sidebar';
import Paginate from '../paginate/Paginate';

export default function ArticlesList(props) {
  const url_to_search = Global.url;
  const params = useParams();
  const [data, setData] = useState({ hits: [] });
  const [propsToUse, setPropsToUse] = useState([]);
  const [paramsToUse, setParamsToUse] = useState(params.search);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState(
    url_to_search+"new-articles/",
  );

  const [page, setPage] = useState({ 
    loading: false,
    currentPage: 1,
    articlesPerPage: 3
  });

  var search_base = propsToUse;
  
  if(search_base.isArchived !== props.isArchived) {

    if(props.isArchived) {
      setUrl(url_to_search + "archived-articles/");
    } else {
      setUrl(url_to_search + "new-articles/");
    }
    setPropsToUse(props)
  }

  if(paramsToUse !== params.search) {
    setParamsToUse(params.search)
    setUrl(url_to_search+"search/"+params.search);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        // Llamamos a la base de datos
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setIsError(true);
        setData({
          status: 'failed'
        })
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const paginate = pageNum => setPage({currentPage: pageNum, articlesPerPage: articlesPerPage});
  const nextPage = () =>  setPage({currentPage: currentPage + 1, articlesPerPage: articlesPerPage});
  const prevPage = () => setPage({currentPage: currentPage - 1, articlesPerPage: articlesPerPage});

  if(data.articles && data.status === 'success') {
   var totalArticles = data.articles.length;
    var { currentPage, articlesPerPage } = page;
    const indexOfLastArticle =  currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    
    var current_articles = data.articles.slice(indexOfFirstArticle, indexOfLastArticle);

    var articles_to_show = current_articles.map((article) => {
      return (
        <div key={article._id} className="articles-element shadow rounded p-3 d-flex flex-column justify-content-center">
          <div className="articles-element-img">
            {article.image &&
              <img alt={article.title} src={url_to_search+'get-image/'+article.image} />
            }
          </div>

          <h2>{article.title}</h2>
          <h3>{article.subtitle}</h3>
          <p><b>{article.author}</b></p>
          <p><Moment fromNow>{article.createdAt}</Moment></p>
          <Link to={'/article/'+article._id} id={article._id} className="text-success">Leer artículo</Link>
        </div>
      );
    });
  } else if(!data.articles || data.status === 'error') {
    var articles_to_show = <p>Todavía no hay artículos</p>;
  } else {
    var articles_to_show = <p>Cargando artículos...</p>;
  }
  return(
    <>
      <Sidebar />
      <section className="content py-5 bg-light">
        <div className="title">
        <Title title={props.title} />
        </div>
        <div className="articles">
          {articles_to_show}
        </div>
        <Paginate articlesPerPage={page.articlesPerPage} totalArticles={totalArticles} paginate={paginate} nextPage={nextPage} prevPage={prevPage} currentPage={page.currentPage} />
      </section>
    </>
  )
}