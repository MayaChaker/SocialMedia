import "./closeFriend.css";

function CloseFriend({ user }) {
  return (
    <li className="sidebarFriend">
      <img className="sideFriendImg" src={user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}

export default CloseFriend;
