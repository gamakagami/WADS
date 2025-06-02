/* eslint-disable react/prop-types */
function ServiceCard({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink,
  iconProps = { size: 30 }, // Default icon props
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
      <Icon {...iconProps} />
      <h3 className="font-semibold text-lg mt-4 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <a
        href={buttonLink}
        className="bg-[#0A3E7A] text-white px-4 py-2 rounded-md text-sm"
      >
        {buttonText}
      </a>
    </div>
  );
}
export default ServiceCard;
