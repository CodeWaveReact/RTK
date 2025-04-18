import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchUsers } from "../api/api-list";
import Loading from "../layout/loading";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setPageNumber } from "../redux/slices/posts-slice";

interface Post {
  id: number;
  title: string;
  userId: number;
  body: string;
}

const SinglePagination = () => {
  const { pageNumber } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
  const itemsPerPage = 5;

  // Calculate total pages (assuming we have 100 total items)
  const totalPages = Math.ceil(100 / itemsPerPage);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["with-pagination", pageNumber],
    queryFn: () => fetchUsers({ pageParam: pageNumber, perPage: itemsPerPage }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.length === 0) {
      dispatch(setPageNumber(pageNumber - 1));
    }
  }, [pageNumber, data, dispatch]);

  if (isPending) return <Loading />;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h1 className="heading-primary">
        <span>Single Pagination</span>
      </h1>

      <ul className="section-accordion" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.length &&
          data?.map((curElem:Post) => {
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
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
        <button disabled={pageNumber === 1} style={{ cursor: pageNumber === 1 ? "not-allowed" : "pointer" }} onClick={() => dispatch(setPageNumber(pageNumber - 1))}>
          Previous
        </button>
        <p>{pageNumber}</p>
        <button disabled={isFetching || pageNumber === totalPages} style={{ cursor: pageNumber === totalPages ? "not-allowed" : "pointer" }} onClick={() => dispatch(setPageNumber(pageNumber + 1))}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SinglePagination;
