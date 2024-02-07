export type AuthAdminData = {
  token: string;
};

export type AuthAdminClient = {
  login(email: string): Promise<AuthAdminData>;
  loginRedirect(email: string): Promise<boolean>;
  loginWithCredential: (credential: string) => Promise<string | null>;
  verifyUser(): Promise<AuthAdminData>;
};
