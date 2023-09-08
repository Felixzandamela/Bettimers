import React,{useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

export default function CheckAuth({children}){
  const location=useLocation();
  const navigate=useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  useEffect(()=>{
    if(!isAuthenticated && location.pathname !=="/login"){
      navigate("/login", {replace:true});
    }
  },[location.pathname]);
  return <div>{children}</div>;
}