/* eslint-disable react/prop-types */
import Toggle from "./Toggle";
import SettingDesc from "./SettingDesc";
import Label from "./Label";

const ContentToggle = ({ text, desc, checked, onChange }) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex-1 mr-4">
        <Label children={text} />
        <SettingDesc desc={desc} />
      </div>
      <div className="flex-shrink-0">
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
};


export default ContentToggle;
