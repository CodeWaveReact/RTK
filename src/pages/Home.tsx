import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/api-list";
import Loading from "../layout/loading";

export const Home = () => {
  const { data : profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <div>
        <figure className="snip1344">
          <img src={profileData?.avatar} alt={profileData?.name} className="background" />
          <img src={profileData?.avatar} alt={profileData?.name} className="profile" />
          <figcaption>
            <p>{profileData?.email}</p>
            <h2>{profileData?.role}</h2>
            <p>{profileData?.password}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
