import {EmailInput, PasswordInput} from "../components/TextInput.tsx";
import {login} from "../net/api.ts";
import {useNavigate} from "react-router";

export function Login() {
  let navigate = useNavigate();

  const loginCall = async (formData: FormData) => {
    let status = await login({
      email: formData.get("email")! as string,
      password: formData.get("password")! as string
    });
    if (status === "NO_NET") {
      console.error("No network");
    } else if (status === "NO_USER") {
      console.error("Email or password not valid");
    } else {
      localStorage.setItem("token", status.token);
      navigate("/");
    }
  }

  return (
    <>
      <form className="flex w-full flex-col p-2 space-y-2 items-center" action={loginCall}>
        <EmailInput name="email" required={true}></EmailInput>
        <PasswordInput name="password" required={true}></PasswordInput>
        <button className="btn btn-wide" type="submit">Login</button>
      </form>
    </>
  );
}