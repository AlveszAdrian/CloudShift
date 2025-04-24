import "next-auth";

declare module "next-auth" {
  /**
   * Estendendo o objeto de usuário
   */
  interface User {
    id: string;
    name: string;
    email: string;
  }

  /**
   * Estendendo o objeto de sessão
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** 
   * Estendendo o token JWT
   */
  interface JWT {
    id: string;
  }
} 