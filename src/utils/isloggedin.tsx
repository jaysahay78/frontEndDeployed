import { cookies } from 'next/headers';

export const isLoggedin = () => {
  const token = cookies().get('token')?.value;
  return token != undefined;
}
