import { useEffect, useState } from "react";
import "./comments.css";
import useFirestore from "../Login/app/firestore";
import showMessage from "../Login/app/showMessage";
import { useComments } from "../../contexts/CommentsContext";

export default function Comments({ id }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const { user, handleAddCommentToUserGame, handleRemoveCommentFromUserGame, handleEditCommentFromUserGame } = useFirestore();
    const { commentsInVideogames } = useComments();

    useEffect(() => {
        const filterCommentByGame = commentsInVideogames.map(({ gameComments, uid, userCommentPhoto }) => {
            return gameComments
                .filter(gameComment => gameComment.id === id)
                .map(gameComment => ({
                    ...gameComment,
                    userUID: uid,
                    userCommentPhoto: userCommentPhoto
                }));
        }).flat();

        const allCommentsInThatGame = filterCommentByGame.map(comment => ({
            comments: comment.gameComment,
            photo: comment.userCommentPhoto,
            uid: comment.userUID
        }));

        setComments(allCommentsInThatGame);
    }, [commentsInVideogames, id]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleEditCommentChange = (e) => {
        setEditedComment(e.target.value);
    };

    const handlePostComment = () => {
        if (user) {
            if (newComment.trim() !== '') {
                const newCommentObj = {
                    comments: [newComment],
                    photo: user.photoURL, // Assuming the user object has a photoURL property
                    uid: user.uid
                };
                setComments([...comments, newCommentObj]);
                handleAddCommentToUserGame(id, newComment);
                setNewComment('');
            } else {
                showMessage("Type something to post!", "error");
            }
        } else {
            showMessage("You must be logged", "error");
        }
    };

    const handleEdit = (userIndex, commentIndex, commentText) => {
        setEditingCommentId({ userIndex, commentIndex });
        setEditedComment(commentText);
    };

    const handleSaveEdit = () => {
        if (editedComment.trim() !== '') {
            const updatedComments = comments.map((userObj, userIndex) => {
                if (userIndex === editingCommentId.userIndex) {
                    const updatedTexts = userObj.comments.map((comment, commentIndex) => 
                        commentIndex === editingCommentId.commentIndex ? editedComment : comment
                    );
                    return { ...userObj, comments: updatedTexts };
                }
                return userObj;
            });

            setComments(updatedComments);
            handleEditCommentFromUserGame(id, editingCommentId.commentIndex, editedComment);
            setEditingCommentId(null);
            setEditedComment('');
        }
    };

    const handleDelete = (userIndex, commentIndex) => {
        const updatedComments = comments.map((userObj, commentIndex) => {
            if (commentIndex === userIndex) {
                const updatedTexts = userObj.comments.filter((_, index) => index !== commentIndex);
                return { ...userObj, comments: updatedTexts };
            }
            return userObj;
        }).filter(userObj => userObj.comments.length > 0);

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
                    {comments.length === 0 ? (
                        <p className="d-flex align-items-center justify-content-center w-100 fs-4">Any comments yet, post something!!</p>
                    ) : (
                        comments.map((userObj, userIndex) => (
                            <li className="d-flex flex-column gap-3 w-100" key={userIndex}>
                                {userObj.comments.map((commentText, commentIndex) =>
                                    editingCommentId && editingCommentId.userIndex === userIndex && editingCommentId.commentIndex === commentIndex ? (
                                        <div className="editComment-box" key={commentIndex}>
                                            <img className="user-profile" src={userObj.photo} alt="profile-picture" />
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
                                        <div className="postedComment-box" key={commentIndex}>
                                            <img className="user-profile" src={userObj.photo} alt="profile-picture" />
                                            <div>
                                                <p className="m-0 comment-content">{commentText}</p>
                                                {user?.uid === userObj.uid && (
                                                    <div className="d-flex gap-4">
                                                        <button id="editComment-btn" onClick={() => handleEdit(userIndex, commentIndex, commentText)}>
                                                            <span className="material-symbols-outlined text-warning">
                                                                edit
                                                            </span>
                                                        </button>
                                                        <button id="deleteComment-btn" onClick={() => handleDelete(userIndex, commentIndex)}>
                                                            <span className="fas fa-trash-alt text-danger"></span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
