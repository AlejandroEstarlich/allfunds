import React, { useState } from 'react';
import Title from '../title/Title';
import axios from 'axios';
import Global from '../../Global';
import SimpleReactValidator from 'simple-react-validator';
import './NewArticle.scss';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function NewArticle(props) {

  var titleRef = React.createRef();
  var subtitleRef = React.createRef();
  var contentRef = React.createRef();
  var authorRef = React.createRef();

  const url_to_search = Global.url;
  const navigate = useNavigate();
  const validator = new SimpleReactValidator({autoForceUpdate: this});
  const [img, setImg] = useState({ hits: [] });
  const [form, setForm] = useState({ 
    article: {}
   });


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
  }

  async function createArticle (e) {
    // Evitamos que al página recargue
    e.preventDefault();

    // Llamamos la función para rellenar state en el formulario
    changeState();

    if(validator.allValid()) {
      await axios.post(url_to_search+"save", form.article)
        .then( res => {
          if(res.data.article) {
            setForm({
              article: res.data.article,
              status: 'waiting'
            })

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
                      status: 'success'
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
            status: 'success'
          });
          swal(
            'Article created',
            'Article has been created successfully',
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
      changeState();
    }
  }

  if(form.status === 'success') { navigate('/') };

  var title = props.title;

  return (
    <section className='content py-5'>
      <Title title={title} />

      <form className="w-50 m-auto"  encType="multipart/form-data" onSubmit={createArticle}>
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" name="title" id="title" aria-describedby="title" placeholder="Enter article title" onChange={changeState} ref={titleRef} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="author">Author</label>
          <input type="text" className="form-control" id="author" aria-describedby="author" placeholder="Enter article author" onChange={changeState} ref={authorRef} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="subtitle">Subtitle</label>
          <input type="text" className="form-control" id="subtitle" aria-describedby="subtitle" placeholder="Enter article subtitle" onChange={changeState} ref={subtitleRef} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="image" className="mx-2">Article Image</label>
          <input type="file" className="form-control-file" onChange={onFileChange} name="articleImage" id="image" accept=".jpg,.gif.png.jpeg" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="content">Content</label>
          <textarea rows="30" className="form-control" id="content" aria-describedby="content" placeholder="Enter article content" onChange={changeState} ref={contentRef} required />
        </div>
        <div className="form-group mb-3">
          <input type="submit" className="btn btn-success" value="Create article" />
        </div>
        
      </form>
    </section>
  );
}
