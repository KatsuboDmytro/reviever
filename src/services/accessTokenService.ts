import Cookies from "js-cookie";

const key = "accessToken";

function get(): string | undefined {
  return Cookies.get(key) || undefined;
}

function save(token: string): void {
  Cookies.set(key, token, { expires: 1 });
}

function remove(): void {
  Cookies.remove(key, { path: "/" });
}

export const accessTokenService = { get, save, remove };
