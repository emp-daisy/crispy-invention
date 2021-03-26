import React from "react";
import { Subject } from "rxjs";
import { map, mergeMap, takeUntil } from "rxjs/operators";
import { fetch } from "../shared/services/api-service/api.service";

const useRepoDetail = (username: string, repo: string) => {
  const [repository, setRepository] = React.useState<Record<
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

  const getRepository = () => {
    fetch(`https://api.github.com/repos/${username}/${repo}`)
      .pipe(
        takeUntil(destroyed$),
        mergeMap((profileRes: any) =>
          fetch(
            `https://api.github.com/repos/${username}/${repo}/contributors?per_page=10&page=1`
          ).pipe(
            takeUntil(destroyed$),
            map((contributorsRes: any) => ({
              ...profileRes.data,
              contributors: contributorsRes.data,
              repo_pages: contributorsRes.paging?.last,
            }))
          )
        )
      )
      .subscribe(
        (result) => setRepository(result),
        () => setRepository(null)
      )
      .add(() => setLoading(false));
  };

  const onPageChange = (page: number) => {
    setLoading(true);
    fetch(
      `https://api.github.com/repos/${username}/${repo}/contributors?per_page=10&page=${page}`
    )
      .pipe(takeUntil(destroyed$))
      .subscribe(
        (result: any) => {
          setRepository({
            ...repository,
            contributors: result.data,
            repo_pages: result.paging?.last,
          });
          listRef?.current?.scrollIntoView();
        },
        () => setRepository({ ...repository, contributors: [], repo_pages: 0 })
      )
      .add(() => setLoading(false));
  };

  return {
    repository,
    getRepository,
    loading,
    onPageChange,
    listRef,
  };
};

export default useRepoDetail;
