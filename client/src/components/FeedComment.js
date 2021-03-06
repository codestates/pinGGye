import React, { useState, useEffect } from "react";
import "./Styles/FeedComment.css";
import axios from "axios";

import UserImage from "../static/images/mypage.png";

export default function FeedComment({
  feedId,
  comment,
  getComment,
  accessToken,
  userInfo,
}) {
  // ? ###### Default value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  const { nickname, textContent, id } = comment;
  let commentId = id;
  // ? ###### 본인인증 state ######
  // ? # 본인 글에만 수정 / 삭제 기능이 보임.
  const [isMe, setIsMe] = useState(false);
  const handleIsMe = () => {
    setIsMe(true);
    // ? # admin의 경우 모든 댓글에 접근 가능
    if (userInfo.accountType === "admin") setIsMe(true);
    else {
      // ? # 본인 이메일과 댓글 이메일이 같을 경우 수정 가능
      if (userInfo.email === comment.email) {
        setIsMe(true);
      }
    }
  };
  useEffect(() => {
    handleIsMe();
  }, []);

  // ? ###### 댓글 state ######
  const [input, setInput] = useState(textContent);

  // ? ###### 수정 모드인지 판단하는 state ######
  const [isUpdate, setIsUpdate] = useState(false);

  // ? ###### Comment update 기능 ######
  const handleUpdateComment = () => {
    if (isUpdate) {
      axios({
        method: "patch",
        url: `${pinGGyeURL}/feeds/${feedId}/comment`,
        data: { commentId, textContent: input },
        headers: {
          authorization: `Bearer ${accessToken}`,
          logintype: localStorage.getItem("loginType"),
        },
      })
        .then(() => alert("댓글 수정 완료!"))
        .catch(() => alert("본인이 쓴 글만 수정 및 삭제가 가능합니다!"));
    }
    setIsUpdate(isUpdate ? false : true);
  };

  // ? ###### Comment delete 기능 ######
  const handleDeleteComment = () => {
    axios({
      method: "delete",
      url: `${pinGGyeURL}/feeds/${feedId}/comment`,
      data: { commentId },
      headers: {
        authorization: `Bearer ${accessToken}`,
        logintype: localStorage.getItem("loginType"),
      },
    })
      .then(() => {
        getComment();
      })
      .catch(() => alert("본인이 쓴 글만 수정 및 삭제가 가능합니다!"));
  };
  return (
    <>
      <div className="feed__comment-box">
        <div className="feed__userinfo">
          <img className="feed__comment-userImage" src={UserImage} />
          <div className="feed__comment-userName">{nickname}</div>
        </div>
        <div className="feed__comment">
          <div className="feed__comment-center-content">
            {isUpdate ? (
              <input
                className="feed__comment-content border"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            ) : (
              <input
                className="feed__comment-content"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                readOnly
              />
            )}
          </div>
          {isMe ? (
            <div className="feed__comment-right-content">
              <img
                className="comment__icon"
                src="https://cdn2.iconfinder.com/data/icons/vivid/48/pencil-512.png"
                alt="update"
                onClick={handleUpdateComment}
              />
              <img
                className="comment__icon"
                src="https://cdn1.iconfinder.com/data/icons/feather-2/24/trash-2-512.png"
                alt="trash can"
                onClick={handleDeleteComment}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
