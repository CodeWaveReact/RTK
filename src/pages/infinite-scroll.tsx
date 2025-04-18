import React, { Fragment, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { fetchUsers } from "../api/api-list";
import Loading from "../layout/loading";

export interface User {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const InfiniteScroll = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  
  const { data, isPending, hasNextPage, fetchNextPage, status, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["Users"],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  if (isPending) return <Loading />;
  if (status === "error") return <div>Error fetching data</div>;

  return (
    <div>
      <h1 className="heading-primary">
        <span>Infinite Scroll Data</span>
      </h1>
      <ul style={{ textAlign: "center" }}>
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.map((user:User) => (
              <li key={user.id} style={{ padding: "30px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex" }}>
                  <p style={{ padding: "0px", margin: "0px" }}>{user.id}.</p>
                  <p style={{ textTransform: "uppercase", padding: "0px", margin: "0px" }}>{user.title}</p>
                </div>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
      <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
      <button style={{ border: "1px solid green", color: "green", fontSize: "15px", fontWeight: "bold", backgroundColor: "transparent", padding: "10px", borderRadius: "5px" }}>{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Scroll down to load more" : "No more users ..."}</button>
      </div>
    </div>
  );
};

export default InfiniteScroll;
