import { useEffect, useState } from "react";
// import { ChildComment } from "./ChildComment";
import "./styles.css";
import Like from "./Like";
// import ReplyComment from "./ReplyComment";
import RootComponent from "./RootComponent";

const getCommentsFromStorage = () => {
  const storedComment = localStorage.getItem("comments");
  if (storedComment) return JSON.parse(localStorage.getItem("comments"));
  else return [];
};
const Comment = () => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState(getCommentsFromStorage);
  const [time, setTime] = useState(new Date().getTime());
  const [reply, setReply] = useState([{ parentId: null, value: "" }]);
  const [data, setData] = useState([
    {
      id: "",
      reply: false,
      replyValue: ""
    }
  ]);
  const [isLike, setIsLike] = useState([
    {
      id: "",
      like: false
    }
  ]);
  var count = 0;
  const addComment = (e) => {
    if (e.key === "Enter") {
      let dateTime = new Date().getTime();
      let inputValue = { id: dateTime, input: text };
      setComment([...comment, inputValue]);
      setIsLike([
        ...isLike,
        {
          id: inputValue.id,
          like: false
        }
      ]);
      let inputData = { id: dateTime, reply: false, replyValue: "" };
      setData([...data, inputData]);
      setText("");
    }
  };

  const deleteComment = (id) => {
    const afterDeletingComment = comment.filter((elem) => {
      return id !== elem.id;
    });
    setComment(afterDeletingComment);
  };
  const addLike = (id) => {
    setIsLike(
      isLike.map((val) => {
        if (val.id === id && val.like === false) {
          return { ...val, like: true };
        } else if (val.id === id && val.like === true) {
          return { ...val, like: false };
        }
        return val;
      })
    );
  };
  const addReplies = (e, id) => {
    if (e.key === "Enter") {
      setData(
        data.map((val) => {
          if (val.id === id) {
            return { ...val, replyValue: reply };
          }
          return val;
        })
      );
    }
  };
  console.log("Like", isLike);
  const addReply = (id) => {
    setData(
      data.map((val) => {
        if (val.id === id && val.reply === false) {
          return { ...val, reply: true };
        }
        return val;
      })
    );
  };

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comment));
  }, [comment, isLike]);

  useEffect(() => {
    setInterval(function () {
      setTime(new Date().getTime());
      console.log(new Date().getTime());
    }, 60000);
  }, [count]);

  return (
    <>
      <RootComponent postComment={addComment} text={text} setText={setText} />
      <div className="comment_style">
        {comment.map((val) => {
          var timer = Math.trunc(Math.abs((time - val.id) / 60000));
          return (
            <>
              <div className="commentBox">
                <span className="comment">{val.input}</span>
                <div className="comment_button">
                  <span onClick={() => addLike(val.id)}>
                    {isLike.map((value) => {
                      if (val.id === value.id && value.like === true) {
                        return "Liked";
                      } else if (val.id === value.id && value.like === false) {
                        return "Like";
                      }
                    })}
                  </span>
                  <span onClick={() => addReply(val.id)}>Reply</span>
                  <span onClick={() => deleteComment(val.id)}>Delete</span>
                  <span>
                    {timer < 1 ? (
                      <p>sec ago</p>
                    ) : timer > 0 && timer <= 59 ? (
                      <p>{`${timer}m ago`}</p>
                    ) : timer > 59 && timer <= 1439 ? (
                      <p>{`${Math.trunc(timer / 60)}h ago`}</p>
                    ) : (
                      <p>{`${Math.trunc(timer / 1440)}d ago`}</p>
                    )}
                  </span>
                </div>
              </div>
              <span className="">
                {data.map((value) => {
                  if (val.id === value.id && value.reply === true) {
                    return (
                      <input
                        type="text"
                        onChange={(e) => setReply(e.target.value)}
                        onKeyUp={(e) => addReplies(e, value.id)}
                        placeholder="Write a comment..."
                      />
                    );
                  }
                })}
              </span>
              {data?.map((v) => {
                if (v.id === val.id && v.replyValue) {
                  return (
                    <div className="replyBox">
                      <p className="comment">{v.replyValue}</p>
                      <div className="comment_box">
                        <Like
                          val={val}
                          addLike={addLike}
                          isLike={isLike}
                          time={time}
                        />
                        <span onClick={() => addReply(val.id)}>Reply</span>
                        <span onClick={() => deleteComment(val.id)}>
                          Delete
                        </span>
                        <span>
                          {timer < 1 ? (
                            <p>sec ago</p>
                          ) : timer > 0 && timer <= 59 ? (
                            <p>{`${timer} m`}</p>
                          ) : timer > 59 && timer <= 1439 ? (
                            <p>{`${Math.trunc(timer / 60)} h`}</p>
                          ) : (
                            <p>{`${Math.trunc(timer / 1440)} d`}</p>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </>
          );
        })}
      </div>
    </>
  );
};
export default Comment;
