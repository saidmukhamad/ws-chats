declare module "socket.io" {
  export interface Socket {
    data: {
      cookies: {
        [key: string]: string;
      };
    };
  }
}
