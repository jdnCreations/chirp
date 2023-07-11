import Head from "next/head";
import { api } from "~/utils/api";
import { useAuth } from '@clerk/nextjs';
import {SignIn, SignOutButton } from '@clerk/nextjs';
import { type NextPage } from "next";

const Home: NextPage = () => {
  
  const user = useAuth();

  const { data } = api.posts.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isLoaded && <SignIn />}
          {!!user.isLoaded && <SignOutButton />}
        </div>
        <div>
          {data?.map((post) => (<div key={post.id}>{post.content}</div>))}
        </div>
      </main>
    </>
  );
}

export default Home;
