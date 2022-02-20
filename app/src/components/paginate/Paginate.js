import './Paginate.scss';

export default function ArticlesList(props) {
  const {articlesPerPage, totalArticles, paginate, nextPage, prevPage, currentPage} = props;

  const pageNumbers = [];

  for(let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="w-75 m-auto d-flex">
      <ul className="pagination justify-content-center"></ul>
        {currentPage > 1 &&
          <li className="page-item list-unstyled ">
            <span onClick={() => prevPage()} className="page-link">Anterior</span>
          </li>
        }
        {pageNumbers.map(num => (
          <li className="page-item list-unstyled" key={num}>
            <span onClick={() => paginate(num)} className="page-link">{num}</span>
          </li>
        ))}
        {currentPage < pageNumbers.length &&
          <li className="page-item list-unstyled">
            <span onClick={() => nextPage()} className="page-link">Siguiente</span>
          </li>
        }
    </nav>
  )
}