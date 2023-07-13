import { type RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className="p-4 border-b border-slate-400 flex flex-col gap-4">
      <div className="flex gap-4 text-slate-300">
        <Image 
          src={author.profilePicture} 
          alt={`@${author.username}'s profile picture`} 
          width={56}
          height={56}
          className="rounded-full"
          />

        <div className="flex flex-col">
          <div className="flex gap-1">
            <Link href={`/@${author.username}`} >
              <p>{`@${author.username}`}</p>
            </Link>
            <span>·</span>
            <Link href={`/post/${post.id}`}><span>{`${dayjs(post.createdAt).fromNow()}`}</span></Link>
          </div>
          <p className="text-2xl">{post.content}</p>  
        </div>
      </div>
    </div>
  );
}