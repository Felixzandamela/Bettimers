import React from "react";
import {Link} from "react-router-dom";
import {texts} from "./texts/Texts";

const Onboarding = ({lang}) =>{
  React.useEffect(()=>{
  },[lang]);
  return(
    <section className="sec_1 flex_c_c pg_10">
      <div className="w100 onboarding">
        <div className="onboarding-img">
        </div>
        <h3>{texts.onboardingTitle[lang]}</h3>
        <p>{texts.onboardingParag[lang]}</p>
        <div className="flex_c_c pg_20">
          <Link className="a" to="/cabinet">
            <button className="button primary_btn b_radius_30">{texts.onboardingBtn[lang]}</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Onboarding;