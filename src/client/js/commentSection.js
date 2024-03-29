const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".comment__deleteBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  span2.addEventListener("click", handleCommentDeleteClick);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const comment_input = form.querySelector("#comment");
  const text = comment_input.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    comment_input.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleCommentDeleteClick = async (event) => {
  event.preventDefault();
  const targetComment = event.target.parentElement;
  const commentId = targetComment.dataset.id;
  const videoId = videoContainer.dataset.id;

  console.log(commentId);

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  if (response.status === 200) {
    const { deletedCommentId } = await response.json();
  } else {
    console.log(response);
  }
  targetComment.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

[].forEach.call(deleteBtns, function (deleteBtn) {
  deleteBtn.addEventListener("click", handleCommentDeleteClick);
});
