import React from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../shared/components/pagination/pagination";
import Spinner from "../shared/components/spinner/spinner";
import useRepoDetail from "./repository-detail.hook";
import "./repository-detail.scss";

const dateFormat: Record<string, any> = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

const RepositoryDetail = () => {
  const { username, repo}: Record<string, string> = useParams();
  const { getRepository, onPageChange, repository, loading, listRef } = useRepoDetail(username, repo);
  React.useEffect(() => getRepository(), []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loading || repository ? (
        <>
          <div className="repository-info">
            <div className="repository-info__card">
              <div className="repository-info__card--info">
                <div className="repository-info__card--info-name">
                  {repository?.full_name || "***"}
                </div>
                {repository?.description && (
                  <div className="repository-info__card--info-bio">
                    {repository.description}
                  </div>
                )}
                <div className="repository-info__card--info-meta">
                  {repository?.language && (
                    <div className="repository-info__card--info-meta__item">
                      <div className="repository-info__card--info-meta__item-icon"><i className="fa fa-circle"></i></div>
                      <span>{repository.language}</span>
                    </div>
                  )}
                  {repository?.license?.name && (
                    <div className="repository-info__card--info-meta__item">
                      <svg
                        className="repository-info__card--info-meta__item-icon"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        height="16">
                        <path
                          fillRule="evenodd"
                          d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path>
                      </svg>
                      <span>{repository.license.name}</span>
                    </div>
                  )}
                  <div className="repository-info__card--info-meta__item">
                    <span>
                      Last pushed on{" "}
                      {repository?.pushed_at
                        ? new Date(repository.pushed_at).toLocaleString(
                            [],
                            dateFormat
                          )
                        : "***"}
                    </span>
                  </div>
                </div>
                <div className="repository-info__card--info-stats">
                  <ul>
                    <li>
                      {repository?.forks_count || 0} <span>Forks</span>
                    </li>
                    <li>
                      {repository?.watchers_count || 0} <span>Watchers</span>
                    </li>
                    <li>
                      {repository?.stargazers_count || 0} <span>Stars</span>
                    </li>
                    <li>
                      {repository?.open_issues || 0} <span>Issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="repository-contributors" ref={listRef}>
            <h2 className="repository-contributors__title">Contributors</h2>
            <div className="repository-contributors__list">
              {loading || repository?.contributors ? (
                <>
                  {repository?.contributors && (
                    <div className="repository-contributors__list-items">
                      {repository.contributors.map(
                        (contributor: Record<string, any>) => (
                          <div
                            className="repository-contributors__list-item"
                            key={contributor.id}>
                            <Link
                              className="contributor__user"
                              to={`/${contributor.login}`}>
                              <div className="contributor__user-avatar">
                                <img
                                  src={contributor.avatar_url}
                                  alt="avatar"
                                />
                              </div>
                              <div className="contributor__user-info">
                                <h2 className="contributor__user-info--login">
                                  {contributor.login}
                                </h2>
                                <h4 className="contributor__user-info--stats">
                                  Contributions:{" "}
                                  <b>{contributor.contributions}</b>
                                </h4>
                              </div>
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                  )}{" "}
                  <Pagination
                    pages={repository?.repo_pages}
                    onChange={onPageChange}
                  />
                </>
              ) : (
                <div className="repository-contributors__list__not-found">
                  <span>No contributors found!!!</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="repository-info__errored">
          <span>
            Unable to load info for <b>{ repo }</b>!!!
          </span>
        </div>
      )}
      {loading && <Spinner />}
    </>
  );
};

export default RepositoryDetail;
