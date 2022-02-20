import React, { useState, useEffect, Component } from 'react';
import Title from '../title/Title';
import axios from 'axios';
import Global from '../../Global';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditArticle(props) {

  var titleRef = React.createRef();
  var subtitleRef = React.createRef();
  var contentRef = React.createRef();
  var authorRef = React.createRef();

  const url_to_search = Global.url;
  const params = useParams();
  const navigate = useNavigate();
  const validator = new SimpleReactValidator({autoForceUpdate: this});
  const [img, setImg] = useState({ hits: [] });
  const [form, setForm] = useState({ hits: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState(
    url_to_search+"article/"+params.id,
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        var result = await axios(url);
        setForm({
          article: {
            title: result.data.article.title,
            subtitle: result.data.article.subtitle,
            content: result.data.article.content,
            author: result.data.article.author
          }
        });
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  function changeState() {
    setForm({
      article: {
        title: titleRef.current.value,
        subtitle: subtitleRef.current.value,
        content: contentRef.current.value,
        author: authorRef.current.value
      }
    });
  }

  function onFileChange(e) {
    setImg({ articleImg: e.target.files[0] });
    setForm({ 
      article: {
        title: titleRef.current.value,
        subtitle: subtitleRef.current.value,
        content: contentRef.current.value,
        author: authorRef.current.value
      },
      img: true });
  }

  async function editArticle (e) {
    // Evitamos que al página recargue
    e.preventDefault();

    // Llamamos la función para rellenar state en el formulario
    changeState();

    if(validator.allValid()) {
      await axios.put(url_to_search+"article/" + params.id, form)
      
        .then( res => {
          if(res.data.article) {
            setForm({
              article: res.data.article,
              status: 'waiting'
            });

            // Subir imagen
            if(img.articleImg != null) {

              // Sacar id del artículo
              var article_Id = res.data.article._id;

              // Crear form data para el fichero
              const formData = new FormData();

              formData.append('articleImg', img.articleImg, img.articleImg.name);

              // Petición ajax
              axios.post(url_to_search + 'upload-image/' + article_Id, formData)
                  .then(res => {
                    if(res.data.article) {
                      setForm({
                        article: res.data.article,
                        status: 'edited'
                      });
                    }
                    else {
                      setForm({
                        article: res.data.article,
                        status: 'failed'
                      });
                    }
                  })
                  .catch (err => {
                    console.log(err);
                  });
            } else {
              setForm({
                status: 'error'
              })
            }
          }
          setForm({
            status: 'edited'
          });
          swal(
            'Article edited',
            'Article has been edited successfully',
            'success'
          )
        })
        .catch (err => {
          console.log(err);
        });
    } else {
      setForm({
        status: 'failed'
      })
      changeState()
    }
  }

  if(form.status === 'edited') { navigate('/') };

  var title = "Editando artículo";

  if(form.article != null) {
    var edit_form = (
      <form className="w-50 m-auto"  encType="multipart/form-data" onSubmit={editArticle}>
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" name="title" id="title" aria-describedby="title" placeholder="Enter article title" onChange={changeState} ref={titleRef} value={form.article.title} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="author">Author</label>
          <input type="text" className="form-control" id="author" aria-describedby="author" placeholder="Enter article author" onChange={changeState} ref={authorRef} value={form.article.author} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="subtitle">Subtitle</label>
          <input type="text" className="form-control" id="subtitle" aria-describedby="subtitle" placeholder="Enter article subtitle" onChange={changeState} ref={subtitleRef} value={form.article.subtitle} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="image" className="mx-2">Article Image</label>
          <input type="file" className="form-control-file" onChange={onFileChange} name="articleImage" id="image" accept=".jpg,.gif.png.jpeg" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="content">Content</label>
          <textarea rows="30" className="form-control" id="content" aria-describedby="content" placeholder="Enter article content" onChange={changeState} ref={contentRef} value={form.article.content} required />
        </div>
        <div className="form-group mb-3">
          <input type="submit" className="btn btn-success" value="Edit article" />
        </div>
      </form>
    )
  }

  return (
    <section className='content py-5'>
      <Title title={title} />
      {edit_form}
    </section>
  );
}
