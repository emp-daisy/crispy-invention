import React from "react";
import "./pagination.scss";

interface IPagination {
  total?: number;
  pages?: number;
  onChange: (page: number) => void;
}

const Pagination = ({ total, onChange, pages }: IPagination) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const size = React.useMemo(() => 10, []);
  const [pageCount, setPages] = React.useState<number | null>(null);
  const isMounting = React.useRef(true);
  React.useEffect(() => {
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }
    onChange(currentPage);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (total) setPages(Math.ceil(total / size));
  }, [total, size]);
  React.useEffect(() => {
    if (pages) setPages(pages);
  }, [pages]);
  return (
    <>
      {pageCount && (
        <div className="pagination">
          <ul className="pagination__controls">
            <li>
              <button
                type="button"
                className="pagination__controls-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(currentPage - 1 || 1))}>
                &lt; PREV
              </button>
            </li>
            <li>
              <span className="pagination__controls-label">
                Page {currentPage} of {pageCount}
              </span>
            </li>
            <li>
              <button
                type="button"
                className="pagination__controls-btn"
                disabled={currentPage >= pageCount}
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1 || pageCount))
                }>
                NEXT &gt;
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Pagination;
