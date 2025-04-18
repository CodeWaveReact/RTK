import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/api-list";
import Loading from "../layout/loading";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setDynamicPageNumber } from "../redux/slices/posts-slice";
import { User } from "./infinite-scroll";

const DynamicPaginate = () => {
  const dispatch = useAppDispatch();
  const { dynamicPageNumber: pageNumber } = useAppSelector((state) => state.posts);
  const itemsPerPage = 7;

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["dynamic-pagination", pageNumber],
    queryFn: () => fetchUsers({ pageParam: pageNumber, perPage: itemsPerPage }),
    placeholderData: keepPreviousData,
  });

  // Calculate total pages (assuming we have 100 total items)
  const totalPages = Math.ceil(100 / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, pageNumber - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (isPending) return <Loading />;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h1 className="heading-primary">
        <span>Dynamic Pagination</span>
      </h1>

      <ul className="section-accordion" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data?.map((curElem: User) => {
          const { id, title } = curElem;
          return (
            <li key={id} style={{ maxWidth: "100%" }}>
              <p>
                {id} - {title}
              </p>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "80px",
        }}
      >
        <button
          disabled={pageNumber === 1}
          onClick={() => dispatch(setDynamicPageNumber(pageNumber - 1))}
          style={{
            cursor: pageNumber === 1 ? "not-allowed" : "pointer",
            opacity: pageNumber === 1 ? 0.5 : 1,
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          Previous
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => dispatch(setDynamicPageNumber(pageNum))}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: pageNum === pageNumber ? "2px solid #007bff" : "1px solid #ccc",
              backgroundColor: pageNum === pageNumber ? "#007bff" : "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={isFetching || pageNumber === totalPages}
          onClick={() => dispatch(setDynamicPageNumber(pageNumber + 1))}
          style={{
            cursor: pageNumber === totalPages ? "not-allowed" : "pointer",
            opacity: pageNumber === totalPages ? 0.5 : 1,
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicPaginate;
