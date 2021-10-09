import React from "react";

const Like = ({ val, addLike, isLike }) => {
  return (
    <span onClick={addLike}>
      {isLike.map((value) => {
        if (val.id === value.id && value.like === true) {
          return "Liked";
        } else if (val.id === value.id && value.like === false) {
          return "Like";
        }
      })}
    </span>
  );
};

export default Like;
