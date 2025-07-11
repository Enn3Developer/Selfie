import {EmailInput, PasswordInput, TextInput} from "../components/TextInput.tsx";
import {register} from "../net/api.ts";
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import {useNavigate} from "react-router";
import {useState} from "react";

export function Register() {
  let navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function registerCall(formData: FormData) {
    let status = await register({
      email: formData.get("email")! as string,
      password: formData.get("password")! as string,
      displayName: formData.get("displayName")! as string,
      handle: formData.get("handle")! as string,
    });
    console.log(status);
    switch (status) {
      case "NO_NET":
        setError("No network");
        console.error("No network");
        break;
      case "EMAIL_FOUND":
        setError("Email already used");
        console.error("Email already used");
        break;
      case "NO_INSERT":
        setError("Error on server side, contact website owner");
        console.error("Error on server side");
        break;
      default:
        setError(null);
        console.log(status.token);
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
      <form className="flex w-full flex-col p-2 space-y-2 items-center" action={registerCall}>
        <EmailInput name="email" validator={true} required={true} placeholder="mario.rossi@mail.com"/>
        <PasswordInput name="password" validator={true} required={true}/>
        <TextInput name="displayName" title="Display name" placeholder="Mario Rossi" required={true}
                   icon={<PersonOutlineRoundedIcon/>}/>
        <TextInput name="handle" title="Handle" placeholder="mario.rossi" required={true}
                   icon={<AlternateEmailRoundedIcon/>}/>
        <button className="btn btn-wide" type="submit">Register</button>
      </form>
    </>
  );
}