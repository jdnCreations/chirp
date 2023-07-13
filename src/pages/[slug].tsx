import Head from "next/head";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />

  if (!data || data.length === 0) return <div>User has not posted</div> 

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.authorId}/>
      ))}
    </div>
  )
}

const ProfilePage: NextPage<{username: string}> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username
  });

  if (!data) return <div>404</div>
  
  return (
    <>
      <Head>
        <title>{`Chirp | ${data.username ?? ""}`}</title>
      </Head>
      <PageLayout>
        <div className="h-36 border-slate-400 bg-slate-600 relative">
          <Image 
            src={data.profilePicture}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] rounded-full border-4 border-black ml-4"
          >
          </Image>

        </div>
        <div className="h-[64px]" aria-hidden="true"></div>
        <div className="p-4 font-bold text-2xl">
          {`@${data.username ?? ""}`}
        </div>
        <div className="border-b border-slate-400 w-full" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  )
}


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" } 
}

export default ProfilePage;
