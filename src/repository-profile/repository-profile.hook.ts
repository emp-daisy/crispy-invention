import React from "react";
import { Subject } from "rxjs";
import { map, mergeMap, takeUntil } from "rxjs/operators";
import { fetch } from "../shared/services/api-service/api.service";

const useRepoProfile = (username: string) => {
  const [contributor, setContributor] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [loading, setLoading] = React.useState(true);
  const destroyed$ = React.useMemo(() => new Subject(), []);
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(
    () => () => {
      // emit destoyed when unmounting
      destroyed$.next();
      destroyed$.complete();
    },
    [destroyed$]
  );

  const getUserProfile = () => {
    fetch(`https://api.github.com/users/${username}`)
      .pipe(
        takeUntil(destroyed$),
        mergeMap((profileRes: any) =>
          fetch(
            `https://api.github.com/users/${username}/repos?per_page=10&page=1`
          ).pipe(
            takeUntil(destroyed$),
            map((repoRes: any) => ({
              ...profileRes.data,
              repos: repoRes.data,
              contributor_pages: repoRes.paging?.last,
            }))
          )
        )
      )
      .subscribe(
        (result) => setContributor(result),
        () => setContributor(null)
      )
      .add(() => setLoading(false));
  };

  const onPageChange = (page: number) => {
    setLoading(true);
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&page=${page}`
    )
      .pipe(takeUntil(destroyed$))
      .subscribe(
        (result: any) => {
          setContributor({
            ...contributor,
            repos: result.data,
            contributor_pages: result.paging?.last,
          });
          listRef?.current?.scrollIntoView();
        },
        () =>
          setContributor({ ...contributor, repos: [], contributor_pages: 0 })
      )
      .add(() => setLoading(false));
  };

  return { contributor, getUserProfile, loading, onPageChange, listRef };
};

export default useRepoProfile;
