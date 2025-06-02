const ProfileImage = ({ src }) => {
  return (
    <div className="relative w-24 h-24">
      <img
        src={src || "/src/assets/GuestImg.png"}
        alt="Profile Picture"
        className="w-full h-full rounded-full object-cover border-2 border-gray-300"
        onError={(e) => {
          // Fallback if image fails to load
          e.target.src = "/src/assets/GuestImg.png";
        }}
      />
    </div>
  );
};

export default ProfileImage;