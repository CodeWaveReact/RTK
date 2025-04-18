import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/api-list';
import Loading from '../layout/loading';
import { User } from './infinite-scroll';

const ButtonClickGetData = () => {
  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['buttonClickUsers'],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h1 className="heading-primary">
        <span>Button Click Pagination</span>
      </h1>
      
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.map((user:User) => (
              <li key={user.id} style={{ padding: "30px", border: "1px solid #ccc", margin: "10px" }}>
                <div style={{ display: "flex", justifyContent: "start", gap: "10px" }}>
                  <p style={{ padding: "0px", margin: "0px" }}>{user.id}.</p>
                  <p style={{ textTransform: "uppercase", padding: "0px", margin: "0px" }}>{user.title}</p>
                </div>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <div style={{ padding: "20px", textAlign: "center" }}>
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || !hasNextPage}
          style={{ 
            color: "green", 
            fontSize: "15px", 
            fontWeight: "bold", 
            backgroundColor: "transparent", 
            padding: "10px", 
            borderRadius: "5px",
            cursor: "pointer",
            border: "1px solid green"
          }}
        >
          {isFetchingNextPage 
            ? "Loading..." 
            : hasNextPage 
              ? "Load More" 
              : "No more data"}
        </button>
      </div>
    </div>
  );
};

export default ButtonClickGetData;