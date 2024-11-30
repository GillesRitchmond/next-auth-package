import { cookies } from 'next/headers';
import React from 'react'
import ClientHome from './clientHome';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("__Secure-next-auth.session-token")?.value;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXTAUTH_URL}`);
  }

  return <ClientHome user={session.user} />
}

export default Home