import "./Feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { Posts, Users } from "../../dummyData";

function Feed() {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <div className="feedStories">
          {Users.slice(0, 6).map((user) => (
            <div key={user.id} className="storyCard">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="storyImg"
              />
              <span className="storyName">{user.username.split(" ")[0]}</span>
            </div>
          ))}
        </div>
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
