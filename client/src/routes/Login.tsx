import {EmailInput, PasswordInput} from "../components/TextInput.tsx";
import {login} from "../net/api.ts";
import {useNavigate} from "react-router";
import {useState} from "react";

export function Login() {
  let navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const loginCall = async (formData: FormData) => {
    let status = await login({
      email: formData.get("email")! as string,
      password: formData.get("password")! as string
    });
    if (status === "NO_NET") {
      setError("No network");
      console.error("No network");
    } else if (status === "NO_USER") {
      setError("Email or password not valid");
      console.error("Email or password not valid");
    } else {
      setError(null);
      localStorage.setItem("token", status.token);
      navigate("/");
    }
  }

  return (
    <>
      {
        error != null ?
          <div role="alert" className="alert alert-error alert-soft">
            <span>{error}</span>
          </div>
          : undefined
      }
      <form className="flex w-full flex-col p-2 space-y-2 items-center" action={loginCall}>
        <EmailInput name="email" required={true}></EmailInput>
        <PasswordInput name="password" required={true} validator={false}></PasswordInput>
        <button className="btn btn-wide btn-accent" type="submit">Login</button>
      </form>
    </>
  );
}