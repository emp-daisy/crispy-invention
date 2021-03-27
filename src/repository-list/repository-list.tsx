import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../shared/components/pagination/pagination";
import Spinner from "../shared/components/spinner/spinner";
import useRepoList from "./repository-list.hook";
import "./repository-list.scss";

const RepositoryList = () => {
  const [repo] = React.useState("angular");
  const {
    onPageChange,
    contributors,
    activeContributors,
    getUserData,
    listRef,
    loading,
    sortOption,
    setSortOption,
  } = useRepoList(repo);
  React.useEffect(() => getUserData(), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="contributors-list__wrapper">
      {loading || activeContributors ? (
        <>
          <div className="contributors-list__filters-group" ref={listRef}>
            <span>Sort Contributors by</span>
            <ul className="contributors-list__filters">
              <li
                className={`contributors-list__filters-item${
                  sortOption === "contributions" ? " active" : ""
                }`}
                onClick={() => setSortOption("contributions")}
                onKeyUp={() => setSortOption("contributions")}>
                <span className="filters-item-text">Contributions</span>
              </li>
              <li
                className={`contributors-list__filters-item${
                  sortOption === "followers" ? " active" : ""
                }`}
                onClick={() => setSortOption("followers")}
                onKeyUp={() => setSortOption("followers")}>
                <span className="filters-item-text">Followers</span>
              </li>
              <li
                className={`contributors-list__filters-item${
                  sortOption === "public_repos" ? " active" : ""
                }`}
                onClick={() => setSortOption("public_repos")}
                onKeyUp={() => setSortOption("public_repos")}>
                <span className="filters-item-text">Public Repo</span>
              </li>
              <li
                className={`contributors-list__filters-item${
                  sortOption === "public_gists" ? " active" : ""
                }`}
                onClick={() => setSortOption("public_gists")}
                onKeyUp={() => setSortOption("public_gists")}>
                <span className="filters-item-text">Published Gist</span>
              </li>
            </ul>
          </div>
          <div className="contributors-list">
            {activeContributors?.map((contributor: Record<string, any>) => (
              <Link
                to={contributor.login}
                className="contributors-list__user"
                key={contributor.id}>
                <div className="contributors-list__user-avatar">
                  <img src={contributor.avatar_url} alt="avatar" />
                </div>
                <div className="contributors-list__user-info">
                  <h2 className="contributors-list__user-info--fullname">
                    {contributor.name || contributor.login}
                  </h2>
                  <h4 className="contributors-list__user-info--bio">
                    {contributor.bio}
                  </h4>
                  <div className="contributors-list__user-info--records">
                    <span>
                      Contributions: <b>{contributor.contributions}</b>
                    </span>
                    <span>
                      Followers: <b>{contributor.followers}</b>
                    </span>
                    <span>
                      Public Repository: <b>{contributor.public_repos}</b>
                    </span>
                    <span>
                      Published Gists: <b>{contributor.public_gists}</b>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Pagination total={contributors?.length} onChange={onPageChange} />
        </>
      ) : (
        <div className="repository-info__errored">
          <span>
            Unable to load contributors for <b>{repo}</b>!!!
          </span>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default RepositoryList;
