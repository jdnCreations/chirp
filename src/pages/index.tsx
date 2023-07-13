import { api } from "~/utils/api";
import { SignInButton, useUser } from '@clerk/nextjs';
import { type NextPage } from "next";
import toast from "react-hot-toast";

import dayjs from "dayjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";


const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();

    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Please try again later.")
      }
    }
  });

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
      <input 
        type="text" 
        placeholder="Type some emojis!" 
        className="bg-transparent grow outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({content: input});
            }
          }
        }}
        disabled={isPosting}
      />
    {input !== "" && !isPosting && ( 
    <button 
        onClick={() => mutate({ content: input})} 
        className="bg-blue-400 font-bold w-24 h-10 rounded-full self-center">
          Chirp
      </button>)}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20}/>
        </div>
      )}

    </div>
  );
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
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
      <PageLayout> 
        <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && 
          <div className="flex justify-center">
            <SignInButton />
          </div>
        }
        {!!isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  )
}


export default Home
