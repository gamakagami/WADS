import './Toggle.css';

const Toggle = ({ checked, onChange }) => {
  return (
    <div className="contain">
      <button 
        className={`toggle-btn ${checked ? "toggled" : ""}`} 
        onClick={onChange}
      >
        <div className="thumb"></div>
      </button>
    </div>
  );
};

export default Toggle;
