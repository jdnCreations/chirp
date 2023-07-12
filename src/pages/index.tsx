import Head from "next/head";
import { type RouterOutputs, api } from "~/utils/api";
import { SignInButton, useUser } from '@clerk/nextjs';
import {SignIn, SignOutButton } from '@clerk/nextjs';
import { type NextPage } from "next";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;

  return (
  <div className="flex gap-4 w-full">
    <Image 
      src={user.profileImageUrl} 
      alt="Profile Image"
      width={56}
      height={56}
      className="rounded-full"
      />
    <input type="text" placeholder="Type some emojis!" className="bg-transparent grow outline-none"/>
    <button className="bg-blue-400 font-bold w-24 h-10 rounded-full">Chirp</button>
  </div>
  );
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className="p-4 border-b border-slate-400 flex flex-col gap-4">
      <div className="flex gap-4 text-slate-300">
        <Image 
          src={author.profilePicture} 
          alt={`@${author.username}'s profile picture`} 
          width={56}
          height={56}
          className="rounded-full"/>
        <div className="flex gap-1">
          <p>{`@${author.username}`}</p>
          <span>·</span>
          <span>{`${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
      </div>
      <p>{post.content}</p>
    </div>
  );
}

const Feed = () => {

  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id}/>
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full md:max-w-2xl border-x border-slate-400">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && <div className="flex justify-center">
              <SignInButton />
            </div>}
            {!!isSignedIn && <CreatePostWizard />}
          </div>
          
          <Feed />
        </div>
      </main>
    </>
  )
}


export default Home
