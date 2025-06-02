function UserName({ user }) {
  return <h1 className="self-center">{user.firstName} {user.lastName[0]}.</h1>;
}

export default UserName;
