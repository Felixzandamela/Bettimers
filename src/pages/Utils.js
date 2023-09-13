import React,{useEffect,useState} from "react";
import {texts} from "./texts/Texts";

export function getLang(){
  const languageRegex = /^pt-(BR|PT|AO|MZ|CV|GW|TL|ST|GQ)$/;
  const userLang = navigator.language.match(languageRegex) ? 0 : 1;
  const language = localStorage.getItem("language") || userLang;
  return language;
}

export const abbreviation = function(name){
  if(name){
    var firstCharacters = name.split(" ").map(character=>{return character[0]});
    return firstCharacters.length >1 && firstCharacters.slice(-1)!=undefined ? firstCharacters[0]+firstCharacters.slice(-1):firstCharacters[0];
  }
} //abreviatura de nome exemplo: Alberto Souza retorna AS

export const getColor=(color)=>{
  const rgb=new Array();for(var i=0;i<3;i++){color=Math.floor(Math.random()*255);rgb.push(color);}
  return rgb
}// gerar cor aleatória / rgb(12, 56, 255)


export const Avatar = ({avatar,color}) => {
  const colour = color || getColor();
  if(!avatar){return null}
  return(
    <div className="avatar">
      {avatar.avatar &&
        <img className="b_radius_60" src={avatar.avatar}/> ||
        <div className="b_radius_60 flex_c_c" style={{color:`rgb(${colour})`,background:`rgba(${colour},0.20)`}}>{abbreviation(avatar.name)}</div>
      }
    </div>
  );
} //avatar para usuário/ se o usuário não tiver imagem de perfil retorna Abreviatura de nome e core

function commaSaparator(x){ 
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatToUnits(number, abbrevi) {
  const unitsNames = ['','Mil','Milhões','Bilhões','Trilhões' ,'Quadrilhões','Quintilhões','Sextilhões','Setilhões','Octilhões','Nonilhões','Decilhões']; 
  const units = Math.floor(Math.log10(Math.abs(number)) / 3);
  const order = Math.max(0, Math.min(units, unitsNames.length -1 )); 
  const suffix = unitsNames[order]; 
  return (number / Math.pow(10, order * 3)) + suffix;
}
  
export const formatNumber = (num) =>{
  let number = num < 1000000 ? commaSaparator(num) : formatToUnits(num)
  return number
}


export function paginator(items, page, limit){ 
  var page = page || 1,
  pageSize = limit || 50,
  offset = (page - 1) * pageSize,
  pageDatas = items.slice(offset).slice(0, pageSize),
  totalPages = Math.ceil(items.length / pageSize);
  return {
    page: page,
    previousPage: page - 1 ? page - 1 : null,
    nextPage: (totalPages > page) ? page + 1 : null,
    datas: pageDatas,
    pageDetails:{
      offset: items.length > 0 ? offset + 1 : 0,
      skipped: offset + pageDatas.length,
      total:items.length,
      totalPages: totalPages,
    }
  }  
} // pagination datas


const runningDays = function (date){
  var time = (new Date()).getTime() - date.getTime(); 
  return{
    days: Math.floor(time/ 1000/60/60/24),
    seconds:Math.floor(time/ 1000)
  } 
}// contar dias passados específicando o dia 

const timeAgo = (date) => {
  const timeUnits = ["Agora","minuto","hora","dia","mês", "ano"];
  var ms = (new Date()).getTime() - date.getTime(); 
  var seconds = Math.floor(ms / 1000); 
  var minutes = Math.floor(seconds / 60); 
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24); 
  var months = Math.floor(days / 30); 
  var years = Math.floor(months / 12); 
  let runningTime = ms === 0 || seconds < 60 ? {time: seconds, unit:0}
    : minutes < 60 ? {time: minutes, unit:1}
    : hours < 24 ? {time : hours, unit:2}
    : days < 30 ? {time : days, unit:3}
    : months < 12 ? {time:months, unit:4}
    : {time: years, unit:5};
  let currentTimeUnits = runningTime.time > 1 && runningTime.unit === 4 ? "meses" : runningTime.time > 1 ? timeUnits[runningTime.unit]+"s": timeUnits[runningTime.unit];
  return runningTime.unit < 1 ? timeUnits[0] : runningTime.time+" "+currentTimeUnits+" atrás";
}// get time ago exam **June,03 2023 11:48:34**
  
export const formatDate = (d,l) =>{
  const locales =["pt-BR","en-US"];
  const date = new Date(0,d[0]);
  const monthName=date.toLocaleString(locales[l||0],{month:'long'});
  const capitalizeMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const dateToTimer = `${date.toLocaleString(locales[1],{month:'long'})}, ${d[1]} ${d[2]} ${d[3]}`;
  
  let runnintime = runningDays(new Date(dateToTimer));
  return{
    fullDate:`${capitalizeMonth}, ${d[1]} ${d[2]} ${d[3]}`,
    onlyDate:`${capitalizeMonth}, ${d[1]}, ${d[2]}`,
    onlyMonthAndYear:`${capitalizeMonth}, ${d[2]}`,
    timeAgo:timeAgo(new Date(dateToTimer)),
    daysLength: runnintime.days,
    secondsLength: runnintime.seconds
  }
}// formating date to view 

export const getCurrentTime = ()=>{
  const data = new Date();
  let day = [data.getDate()], hour = data.getHours(), min = data.getMinutes(), sec = data.getSeconds();
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;
  let dd = day < 10 ? "0" + day : day;
  let mm = data.getMonth(), yyyy = data.getFullYear();  
  let currentTime = hour + ":" + min + ":" + sec ;
  return{
    fullDate:[mm, dd, yyyy, currentTime],
    onlyTime:currentTime,
    onlyDate:[mm, dd, yyyy],
    onlyMonthAndYear: mm + " "+ yyyy
  }
}// get current time and date

export const expireDay=(duration)=> {
  var date=new Date();   
  Date.prototype.addDays=function(days){   
    let day = new Date(this.valueOf());
    day.setDate(date.getDate()+ days);
    let dd = day.getDate();
    let expireAt =[day.getMonth(), dd < 10 ? "0"+ dd: dd, day.getFullYear(), getCurrentTime().onlyTime];
    return expireAt;
  }
  return date.addDays(duration);
}// get future date by assigning a value of dates

export const MinLoder=()=>{return <div className="min_loader"><div/><div/><div/></div>} // btn loader

export const authErros = [
  {name: "auth/user-not-found",target: "userNotFound"},
  {name:"auth/network-request-failed",target:"networkRequestFailed"},
  {name:"auth/email-already-in-use",target:"emailAlreadyInUse"},
  {name: "auth/weak-password",target:"weakPassword"},
  {name: "auth/invalid-email",target:"invalidEmail"},
  {name: "auth/wrong-password",target:"wrongPassword"}
];// firebase errors fallback

export const Toast = ({props, onClear}) => {
  
  useEffect(()=>{
    if(props){
      setTimeout(()=>{
        onClear();
      },6000);
    }
  },[props]);
  
  if(!props){return null}
  return(
    <div className="box_toast flex_c_c">
      <div className="toast b_radius_3">{props}</div>
    </div>
  );
}

export const Copy = ({lang,value}) =>{
  const [error, setError] = useState(null);
  if(!value){return false}
  function copyValue() {
    var range=document.createRange();
    range.selectNode(document.getElementById("valueToCopyPaste"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    setError(texts.copySuccessful[lang]);
  } 
  
  return(
    <div onClick={()=>copyValue()} className="flex_c_c">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
      </svg>
      <div onClick={()=>copyValue()} className="valueToCopyPaste" id="valueToCopyPaste">{value}</div>
      <Toast props={error} onClear={()=>setError(null)}/>
    </div>
  );
}

export const Exclamation =()=>{
  return (
    <div className="pg_10 flex_c_c">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="red" className="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>
    </div>
  );
}

export const PasswordViewer = ({toggle, onToggle})=>{
  return(
    <div onClick={onToggle} className="password_eye flex_c_c">
      {!toggle && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        </svg>
        ||
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
        </svg>
      }
    </div>
  );
}

export const Loader = ()=>{
  return(
    <div className="loader">
      <svg className="circular" viewBox="25 25 50 50">
        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
      </svg>
    </div>  
  );
}