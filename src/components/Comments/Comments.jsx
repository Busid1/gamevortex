import { useEffect, useState, useRef } from "react";
import "./comments.css"
import useFirestore from "../Login/app/firestore";
import showMessage from "../Login/app/showMessage";
import { useComments } from "../../contexts/CommentsContext";

export default function Comments({ id }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const { user, handleAddCommentToUserGame, handleRemoveCommentFromUserGame } = useFirestore();
    const { commentsInVideogames, photoURLComment } = useComments();

    useEffect(() => {
        const filterCommentByGame = commentsInVideogames.map(({ gameComments }) =>
            gameComments.filter(gameComment => gameComment.id === id)
        ).flat();
        const allCommentsInThatGame = filterCommentByGame.map(comment => comment.gameComment).flat();
        
        setComments(allCommentsInThatGame);
    }, [commentsInVideogames, id])

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleEditCommentChange = (e) => {
        setEditedComment(e.target.value);
    };

    const handlePostComment = () => {
        if (user) {
            if (newComment.trim() !== '') {
                setComments([...comments, newComment]);
            }
            else {
                showMessage("Type something to post!", "error");
            }
        }
        else {
            showMessage("You must be logged", "error");
        }

        handleAddCommentToUserGame(id, newComment);
    };

    const handleEdit = (commentIndex, comment) => {
        setEditingCommentId(commentIndex);
        setEditedComment(comment);
    };

    const handleSaveEdit = () => {
        if (editedComment.trim() !== '') {
            const updatedComments = comments.map((comment, index) =>
                // If the index matches editCommentId then replace the old comment with the new comment 
                index === editingCommentId ? editedComment : comment
            );
            setComments(updatedComments);
            setEditingCommentId(null);
            setEditedComment('');
        }
    };

    const handleDelete = (commentIndex) => {
        const updatedComments = comments.filter((comment, index) => index !== commentIndex);
        setComments(updatedComments);
        handleRemoveCommentFromUserGame(id, commentIndex);
    };

    return (
        <div className="comments-section w-100">
            <h3 className="text-warning">Comments</h3>
            <div className="comment-box">
                <div className="d-flex flex-column align-items-center gap-3">
                    <textarea className="comment-textarea"
                        value={newComment}
                        maxLength={50}
                        onChange={handleCommentChange}
                        placeholder="Write your comment here..."
                    ></textarea>
                    <button className="btn btn-primary" onClick={handlePostComment}>Post Comment</button>
                </div>
                <ul className="d-flex w-100 align-items-center gap-3 flex-wrap m-0 p-0">
                    <span className="d-flex justify-content-center w-100">Recents comments</span>
                    {comments.length === 0 ? (
                        <h3 className="d-flex align-items-center justify-content-center w-100">Any comments yet, post something!!</h3>
                    ) : (
                        comments.map((comment, index) => (
                            <li className="d-flex gap-3 w-100" key={index}>
                                {editingCommentId === index ? (
                                    <div className="editComment-box">
                                        <img className="user-profile" src={photoURLComment[index]} alt="profile-picture" />
                                        <div>
                                            <textarea className="comment-textarea"
                                                value={editedComment}
                                                onChange={handleEditCommentChange}
                                                autoFocus
                                            ></textarea>
                                            <button id="saveComment-btn"
                                                className="d-flex justify-content-center gap-2 w-100 btn btn-success text-white"
                                                onClick={handleSaveEdit}>
                                                Save
                                                <span className="material-symbols-outlined">
                                                    save
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="postedComment-box">
                                        <img className="user-profile" src={user.photoURL} alt="profile-picture" />
                                        <div>
                                            <p className="m-0 comment-content">{comment}</p>
                                            {
                                                user ?
                                                    <div className="d-flex gap-4">
                                                        <button id="editComment-btn" onClick={() => handleEdit(index, comment)}>
                                                            <span className="material-symbols-outlined text-warning">
                                                                edit
                                                            </span>
                                                        </button>
                                                        <button id="deleteComment-btn" onClick={() => handleDelete(index)}>
                                                            <span className="fas fa-trash-alt text-danger"></span>
                                                        </button>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                    <hr className="separator" />

                </ul>
            </div>
        </div>
    )
}