import * as moxios from "moxios";

export function getMoxiosUrl() {
  const {
    config: { method },
    url
  } = moxios.requests.first();
  return {
    method,
    ...splitUrl(url)
  };
}
export function splitUrl(urlIn: String) {
  const [url, qs] = urlIn.split("?");
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
