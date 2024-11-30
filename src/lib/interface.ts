export interface DecodedToken {
    id: string;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }

  export interface UserSession {
    authenticated: boolean;
    user: {
      id: string;
      firstname?: string | null;
      lastname?: string | null;
      email?: string | null;
      image?: string | null;
      access_token?: string | null;
      refresh_token?: string | null;
    } | null;
  }

  export interface User {
    id: string;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    image?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }
  
  export interface UserProps {
    user: User;
  }