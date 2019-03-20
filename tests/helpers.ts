import * as moxios from "moxios";

export function getMoxiosUrl() {
  const {
    config: { method, headers },
    url
  } = moxios.requests.first();
  return {
    method,
    headers,
    ...splitUrl(url)
  };
}
export function splitUrl(urlIn: String) {
  const [url, qs = ""] = urlIn.split("?");
  return {
    url,
    qs: qsToObj(qs)
  };
}
export function qsToObj(qs: String) {
  return qs
    .split("&")
    .map(q => q.split("="))
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
}

export function timer(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
