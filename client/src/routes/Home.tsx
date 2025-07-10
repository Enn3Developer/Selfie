import {Link, useNavigate} from "react-router";
import {checkToken} from "../net/api.ts";
import {Suspense, use, useEffect} from "react";

async function checkTokenValidity() {
  let token = localStorage.getItem("token");

  if (token != null) {
    return await checkToken(token);
  }

  return false;
}

interface AutomaticLoginProps {
  tokenPromise: Promise<boolean>,
}

function AutomaticLogin({tokenPromise}: AutomaticLoginProps) {
  let navigate = useNavigate();
  let isValid = use(tokenPromise);
  console.log(isValid);

  useEffect(() => {
    if (isValid) navigate("user", {replace: true});
    else navigate("login", {replace: true});
  }, [isValid, navigate]);

  return (
    <>
      <Link to="/login">Login</Link>
      <br/>
      <Link to="/register">Register</Link>
    </>
  );
}

export function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutomaticLogin tokenPromise={checkTokenValidity()}/>
    </Suspense>
  );
}