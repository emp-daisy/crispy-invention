import React from "react";
import { EMPTY, of, Subject } from "rxjs";
import {
  catchError,
  concatMap,
  expand,
  filter,
  map,
  mergeMap,
  reduce,
  switchMap,
  takeUntil,
  toArray,
} from "rxjs/operators";
import { fetch } from "../shared/services/api-service/api.service";

const STORAGE_KEY = "angular-github-data";
type SortOption =
  | "public_gists"
  | "public_repos"
  | "followers"
  | "contributions";

const useRepoList = (username: string) => {
  const [contributors, setContributors] = React.useState<
    Record<string, any>[] | null
  >(null);
  const [activeContributors, setActiveContributors] = React.useState<
    Record<string, any>[] | null
  >(null);
  const [sortOption, setSortOption] = React.useState<SortOption>(
    "contributions"
  );
  const [loading, setLoading] = React.useState(true);
  const perPage = React.useMemo(() => 10, []);
  const [page, setPage] = React.useState(1);
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
  React.useEffect(() => {
    if (contributors) {
      onPageChange(page);
    }
  }, [sortOption, contributors]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
      getContributorsDetails();
  }, [sortOption]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSort = (contributorList: any[]) => {
    return (
      contributorList?.sort(
        (a: any, b: any) => b[sortOption] - a[sortOption]
      ) || []
    );
  };

  const getUserData = () => {
    setLoading(true);
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      // if data exist in cache
      setContributors(onSort(JSON.parse(data)));

      setLoading(false);
      return;
    }
    fetch(`https://api.github.com/users/${username}/repos`)
      .pipe(
        takeUntil(destroyed$),
        expand(({ paging }: any) =>
          paging?.next
            ? fetch(
                `https://api.github.com/users/${username}/repos?page=${paging.next}`
              )
            : EMPTY
        ),
        concatMap(({ data }: any) => data),
        mergeMap((res: any) =>
          fetch(res.contributors_url).pipe(
            takeUntil(destroyed$),
            expand(({ paging }: any) =>
              paging?.next
                ? fetch(`${res.contributors_url}?page=${paging.next}`)
                : EMPTY
            ),
            filter(({ data }: any) => !!data),
            concatMap(({ data }: any) => data)
          )
        ),
        reduce((acc: any, val: any) => {
          if (!acc[val.login]) acc[val.login] = {};
          const contributions =
            (acc[val.login].contributions ?? 0) + val.contributions;
          acc[val.login] = { ...acc[val.login], ...val, contributions };
          return acc;
        }, {}),
        map((res) => Object.values(res)),
        switchMap((data) => data),
        mergeMap((res: any) =>
          fetch(res.url).pipe(
            takeUntil(destroyed$),
            catchError(() => of({})), //TODO: Handle rate limit better as this bypasses error from limit
            map(({ data }: any) => ({ ...res, ...data }))
          )
        ),
        toArray()
      )
      .subscribe(
        (res: any) => {
          // to save up on github rate limit
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
          setContributors(onSort(res));
        },
        () => setContributors(null)
      )
      .add(() => setLoading(false));
  };

  const getContributorsDetails = () => {
    if (
      contributors?.filter(({ followers }) => followers === undefined).length
    ) {
      setLoading(true);
      of(contributors)
        .pipe(
          takeUntil(destroyed$),
          switchMap((data: any) => data),
          concatMap((existingData: any) => {
            if (existingData.followers !== undefined) return of(existingData);
            return fetch(
              `https://api.github.com/users/${existingData.login}`
            ).pipe(
              takeUntil(destroyed$),
              catchError(() => of({})), //TODO: Handle rate limit better as this bypasses error from limit
              map(({ data }: any) => ({ ...existingData, ...data }))
            );
          }),
          toArray()
        )
        .subscribe((res) => {
          // to save up on github rate limit
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
          setContributors(onSort(res));
        })
        .add(() => setLoading(false));
    }
  };

  const onPageChange = (page: number) => {
    setLoading(true);
    setPage(page);
    const offset = perPage * (page - 1);
    if (contributors)
      setActiveContributors(
        onSort(contributors)?.slice(offset, perPage * page) || null
      );
    listRef?.current?.scrollIntoView();
    setLoading(false);
  };

  return {
    contributors,
    activeContributors,
    getUserData,
    loading,
    onPageChange,
    listRef,
    sortOption,
    setSortOption,
  };
};

export default useRepoList;
