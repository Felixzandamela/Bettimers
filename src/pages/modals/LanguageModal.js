import React from "react";
import {getLang} from "../Utils";
const LanguageModal = ({open,onChangeLang}) => {
  const [value,setValue] = React.useState(getLang());
  const languag =[{label:"Portuguese", value:"0"},{label:"English", value:"1"}];
  
  const handleChangeLang=(event)=>{
    const lang = event.target.value;
    setValue(lang);
    localStorage.setItem("language", lang);
    onChangeLang(lang);
  }
  if(!open){return null}
  return (
    <div className="pop_menu flex_c_c">
    <div className="bc_white b_radius_8">
      <div className="menu_body">
        {languag.map(status=>(
        <label key={status.label}>
          <div className="f_memu_btn flex_s_c">
            <input name="selectData" type="radio" className="input_radio_menu" checked={value === status.value} value={status.value} onChange={handleChangeLang} /> {status.label}
          </div>
        </label>
        ))}
      </div>
    </div>
    </div>
  );
}
export default LanguageModal;