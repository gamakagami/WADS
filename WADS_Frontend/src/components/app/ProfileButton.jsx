function ProfileButton({user}) {

  return (
    <>      
        <div className="rounded-full bg-[#1D3B5C] w-8 h-8 mr-2 flex items-center justify-center">
          {user.profilePicture ? 
            <img src={user.profilePicture} className="w-full h-full rounded-full" /> :
            <span className="text-white text-sm font-medium select-none">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
          }
        </div>
    </>
  );
}

export default ProfileButton;
