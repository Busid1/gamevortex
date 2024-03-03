import { useEffect, useState, useRef } from "react";
import "./comments.css"

export default function Comments() {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleEditCommentChange = (e) => {
        setEditedComment(e.target.value);
    };

    const handlePostComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    const handleEdit = (id, comment) => {
        setEditingCommentId(id);
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

    const handleDelete = (id) => {
        const updatedComments = comments.filter((comment, index) => index !== id);
        setComments(updatedComments);
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
                <hr className="separator" />
                <ul className="d-flex w-100 align-items-center gap-3 flex-wrap m-0 p-0">
                    <span className="d-flex justify-content-center w-100">Recents comments</span>
                    {comments.map((comment, index) => (
                        <li className="d-flex gap-3 w-100" key={index}>
                            {editingCommentId === index ? (
                                <div className="editComment-box">
                                    <img className="user-profile" src="https://i.pinimg.com/564x/5d/2a/d1/5d2ad10c1f4e6b0136e8abddb6205102.jpg" alt="profile-picture" />
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
                                    <img className="user-profile" src="https://i.pinimg.com/564x/5d/2a/d1/5d2ad10c1f4e6b0136e8abddb6205102.jpg" alt="profile-picture" />
                                    <div>
                                        <p className="m-0 comment-content">{comment}</p>
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
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}