const UserPage = ({ user }) => {
  return (
    <div>
      <div className="container text-center">
        <h1>{ user.username }</h1>
      </div>
    </div>
  );
}

export default UserPage;
