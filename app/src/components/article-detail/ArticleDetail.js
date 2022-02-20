import React, { useState, useEffect } from 'react';
import Title from '../title/Title';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from '../../Global';
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import './ArticleDetail.scss';
import Sidebar from '../sidebar/Sidebar';

export default function ArticleDetail(props) {
  const url_to_search = Global.url;
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ hits: [] });
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState(
    url_to_search+"article/" + params.id,
  );
  
  
  var article = '';
  var article_title = '';

  function deleteArticle() {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this article?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        setOrder('delete');
        setUrl(url_to_search + "delete-article/" + params.id);
        swal(
          'Article deleted',
          'Article has been removed successfully',
          'success'
        )
      } else {
        swal("Safe!", "Article is safe");
      }
    });

  }

  function archiveArticle() {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to archive this article?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        setOrder('put');
        setUrl(url_to_search + "archive-article/" + params.id);
        swal(
          'Article archive',
          'Article has been archived successfully',
          'success'
        )
      } else {
        swal("Safe!", "Article is safe");
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        var result;
        switch(order) {
          case 'put': 
            result = await axios.put(url);
          break;
          case 'delete':
            result = await axios.delete(url);
          break;
          default:
            result = await axios(url);
          break;
        }
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  if(data.status === 'archived') { navigate('/');}
  if(data.status === 'deleted') { navigate('/');}

  if(data.article != null) {
    var article_data = data.article;
    
    article_title = article_data.title;
    article = (
      <div key={article_data._id} className="article-detail w-75 p-3 m-auto">
        {article_data.image &&
          <img className="w-100" alt={article_data.title} src={url_to_search+'get-image/'+article_data.image} />
        }
        <h3 className="mt-5">{article_data.subtitle}</h3>
        <p><b>Un artículo de {article_data.author}</b></p>
        <p><Moment fromNow>{article_data.createdAt}</Moment></p>
        <p>{article_data.content}</p>
        {article_data.is_archived === true &&
          <p className="my-3">Archivado: <Moment fromNow>{article_data.archived_date}</Moment></p>
        }
        <button onClick={
          () => {
            deleteArticle();
          }
          } className="btn btn-danger m-2">Delete Article</button>
        <button onClick={
          () => {
            navigate('/edit-article/'+article_data._id);
          }
        } className="btn btn-success m-2">Edit Article</button>
        {article_data.is_archived === false && 
          <button onClick={
            () => {
              archiveArticle(article_data._id);
            }
          } className="btn btn-dark mx-2">Archive Article</button>
        }
        
      </div>
    );
  } else if(data.article === undefined) {
    article = <p>No existe este artículo</p>;
  } else {
    article = <p>Cargando artículo...</p>;
  }
    return(
      <>
        <Sidebar />
        <section className="content py-5 bg-light ">
          <Title title={article_title} />
          {article}
        </section>
      </>
    )
}