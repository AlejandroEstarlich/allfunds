import React, {Component} from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
// import { RouterProps } from 'react-router-dom';

import MiComponente from './components/mi-componente/MiComponente';
import Error from './components/error/Error';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ArticlesList from './components/articles-list/ArticlesList';
import NewArticle from './components/new-article/NewArticle';
import ArticleDetail from './components/article-detail/ArticleDetail';
import EditArticle from './components/edit-article/EditArticle';
export default function Router() {

    return(
      // Configurar rutas y páginas
      <BrowserRouter>
        <header className="navbar navbar-expand-lg navbar-light bg-white shadow">
          <Header />
        </header>
        <main className="components">

          <Routes>
            <Route exact path='/' element={<ArticlesList title='Latest News' />} />
            <Route exact path='/articles' element={<ArticlesList  title='Latest News' />} />
            <Route exact path='/archived-articles' element={<ArticlesList isArchived={true} title='Archived News' />} />
            <Route exact path='/new-article' element={<NewArticle title='Create Article' />} />
            <Route exact path='/search/:search' element={<ArticlesList isSearched={true} title='Search Results' />} />

            <Route exact path='/article/:id' element={<ArticleDetail />} />

            <Route exact path='/edit-article/:id' element={<EditArticle />} />

            {/* Ruta para error */}
            <Route path="*" element={<Error />} />
          </Routes>

        </main>
        <footer className="bg-dark text-center text-white">
          <Footer />
        </footer>
      </BrowserRouter>
    );
  }

// export default Router;