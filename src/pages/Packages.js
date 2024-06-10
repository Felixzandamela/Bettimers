import React,{useState, useEffect,useRef} from "react";
import {Link,useNavigate} from "react-router-dom";
import {texts} from "./texts/Texts";
import {MinLoder, Toast,formatNumber, Loader} from "./Utils";
import {packages} from "./texts/packages";
const Packages = ({lang}) =>{
  const [value, setValue] = useState("monthly");
  const [massage, setMassage] = useState(null);
  const handleChange =(event)=>{
    setValue(event.target.value);
  }
  useEffect(()=>{
    setMassage(`${texts.messagePackage[lang]} ${texts.access[lang].toLowerCase()} ${texts[value][lang]}`);
  },[value,lang,packages]);
  
  const handleSend = () => {
    const number = "+258849040552";
    window.open("https://api.whatsapp.com/send?phone="+number+"&text="+massage);
  }
  if(!packages){return <Loader/>}
  return(
    <section className="pg_10 sec_packages">
      <div className="pg_10 package_title">{texts.packagesTitle[lang]}</div>
      {packages && packages.map(p=>(
      <div key={p.name} className="wrap_packs">
          <input onChange={handleChange} checked={value === p.name} className="input_radio" name="package" value={p.name} id={p.name} type="radio"/>
          <label htmlFor={p.name}>
            <div  className="card_packs flex_b_c">
            <div>
              <div className="pack_name">
                {texts.access[lang]} {texts[p.name][lang]}
              </div>
              <div className="pack_amount"> {formatNumber(p.amount)} MZN/<span>{p.prefix[lang]}</span></div>
            </div>
              {p.discount > 0 && <div className="b_radius_30 discount">{texts.economize[lang]} {p.discount}%</div>}
            </div>
          </label>
        </div>
      ))}
        <div className="flex_c_c">
          <button onClick={handleSend} className="button primary_btn b_radius_3">
            {texts.continues[lang]}
          </button>
        </div>
    </section>
  );
}

export default Packages;