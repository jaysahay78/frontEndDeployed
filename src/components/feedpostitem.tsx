import { Post } from "@/utils/post-service";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";

function timeAgo(timestamp: number | string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Unknown time";
  return formatDistanceToNow(date, { addSuffix: true });
}


interface FeedPostItemProps {
    post: Post,
    highlight: string;
  }

// Utility: safely strip HTML tags
function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]+>/g, '').trim();
  }


export default function FeedPostItem({ post, highlight }: FeedPostItemProps) {

  const highlightText = (text: string) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return (
      <span dangerouslySetInnerHTML={{
        __html: text.replace(regex, `<mark class="bg-violet-500">$1</mark>`)
      }} />
    );
  };

    const previewText = stripHtmlTags(post?.content).substring(0, 60);

    return (
        <div className="flex flex-col md:flex-row gap-6 py-6 border-b border-gray-300">
            {post?.imageName !== "default.png" && (
                          <div className="image-container pt-2">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/image/${post?.imageName}`}
                              alt="post image"
                              className="rounded-2xl shadow-[1px_4px_27px_-13px_#000000] scale-90"
                              height={225}
                              width={400}
                              unoptimized
                            />
                          </div>
                        )}

            {/* Post Details */}
            <div className="flex flex-col gap-3 justify-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {highlightText(post?.title)}
                </h1>
                <div className="text-sm text-gray-500">
                    Written by <span className="text-blue-600">{post?.user.name}</span> · {timeAgo(post.addedDate)} 
                </div>
                <p className="text-gray-700 text-sm">{previewText}...</p>
                <Link href={`/singlepage/`+post?.postId} className="text-blue-600 text-sm font-medium w-fit hover:underline">
                    read more
                </Link>
            </div>
            
        </div>
    );
}
