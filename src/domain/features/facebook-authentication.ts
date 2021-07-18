export interface FacebookAuthentication {
  execute(token: string): string | Error;
}
