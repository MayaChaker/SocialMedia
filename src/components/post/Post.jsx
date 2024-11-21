import "./Post.css";
import { MoreVert } from "@mui/icons-material";

function Post() {
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src="public/assets/person/img1.jpg"
              alt=""
            />
            <span className="postUsername">Safak Kocaoglu</span>
            <span className="postDate">5 mins ago</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">Hey! Its my first post:)</span>
          <img src="public/assets/ad.png" alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src="public/assets/like.png" alt="" className="likeIcon" />
            <img src="public/assets/heart.png" alt="" className="likeIcon" />
            <span className="postLikeCounter">32 people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">9 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
