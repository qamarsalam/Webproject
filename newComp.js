import { useState } from "react";

export default function AddComment({ onAdd }) {
  const [newComment, setNewComment] = useState("");

  function handleSubmit() {
    if (newComment.trim() === "") return;

    onAdd(newComment);   
    setNewComment("");   
  }

  return (
    <div>
      <textarea
        placeholder="write a comment....."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Add comment</button>
    </div>
  );
}