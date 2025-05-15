export type IAuth = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: string;
};

export interface IUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  created: string;
  email: string;
  accounts: Account[];
}

export interface Account {
  account_id: string;
  is_default: boolean;
  account_name: string;
  base_uri: string;
}

export interface BaseDocusignPaginatedResponse{
  nextUri: string,
  previousUri: string
  resultSetSize: string
  totalSetSize: string
}