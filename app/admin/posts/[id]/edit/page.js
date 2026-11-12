import { PostForm } from "../../../../../components/AdminData";

export default async function EditPostPage({ params }) {
  return <PostForm postId={(await params).id} />;
}
