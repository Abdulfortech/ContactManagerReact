export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  userId?: string;
}