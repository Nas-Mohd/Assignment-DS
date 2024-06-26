// components/shared/ThreadsTab.tsx

import { redirect } from "next/navigation";
import { fetchUserPosts, fetchUserReplies } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    likedBy: string[];
    children: {
      author: {
        id: string;
        image: string;
      };
    }[];
    deleted: boolean;
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  posts?: any[];
}

async function ThreadsTab({ currentUserId, accountId, accountType, posts }: Props) {
  let result: Result | null;

  result = await fetchUserPosts(accountId);
  if (!result) {
    return null;
  }
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {(posts || result.threads).map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likedBy}
          deleted={thread.deleted}
          isComment={thread.parentId}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
