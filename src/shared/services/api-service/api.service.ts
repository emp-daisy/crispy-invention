import { Observable } from "rxjs";
import axios from "axios";

const parseGithubPagination = (link: string) =>
  link
    .split(",")
    .map((rel) => {
      const [page, pageRel] = rel.split(";");
      return [
        /[^_]page=(\d+)/.exec(page)?.[1] || "",
        /rel="(.+)"/.exec(pageRel)?.[1] || "",
      ];
    })
    .reduce((obj: Record<string, any>, curr: string[]) => {
      obj[curr[1]] = parseInt(curr[0], 10);
      return obj;
    }, {});
const access_token ='de74bdd22094f582bbcb46527381ef2a0e5c9e84'
export const fetch = (url: string) =>
  new Observable((observer) => {
    axios
      .get(url, {
        headers: {
          'Authorization': `token ${access_token}`
        }
      })
      .then((response) => {
        observer.next({
          data: response.data,
          paging: response?.headers?.link
            ? parseGithubPagination(response.headers.link)
            : null,
        });
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
