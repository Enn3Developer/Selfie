import {ReactNode, RefObject, useRef, useState} from "react";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

export interface InputProps {
  name?: string | undefined;
  validator?: boolean | undefined;
  placeholder?: string | undefined;
  icon?: ReactNode | undefined;
  required?: boolean | undefined;
  children?: ReactNode | undefined;
  type?: string | undefined;
  className?: string | undefined;
  pattern?: string | undefined;
  title?: string | undefined;
  tooltips?: string | undefined;
  additionalProps?: any;
  ref?: RefObject<HTMLInputElement | null> | undefined;
  value?: string | undefined;
}

function concatStr(str: string, spacing: boolean, ...strings: (string | undefined)[]): string {
  let newStr = structuredClone(str);
  for (let maybeStr of strings) {
    if (maybeStr !== undefined) newStr = newStr.concat(spacing ? " " : "", maybeStr);
  }

  return newStr;
}

export function PasswordInput(props: InputProps) {
  let [isVisible, setVisibility] = useState(false);
  let ref = useRef<HTMLInputElement>(null);

  const toggleVisibility = () => {
    setVisibility(!isVisible);
    if (ref.current) {
      ref.current.focus();
    }
  };

  let inputProps = {...props};
  inputProps.icon = props.icon || (<KeyRoundedIcon/>);
  inputProps.title = props.title ? props.title : "Password";
  inputProps.placeholder = props.placeholder ? props.placeholder : "Password";
  inputProps.pattern = props.validator ? "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" : undefined;
  inputProps.tooltips = props.validator ? "Must be more than 8 characters, including number, lowercase letter, uppercase letter" : undefined;
  return (
    <>
      <TextInput {...inputProps} type={isVisible ? "text" : "password"}
                 additionalProps={{minLength: props.validator ? 8 : 1}} ref={ref}>
        <p className="btn btn-ghost h-[2em]" onClick={toggleVisibility}>
          {isVisible ? <VisibilityOffRoundedIcon/> : <VisibilityRoundedIcon/>}
        </p>
      </TextInput>
      {props.validator &&
          <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
          </p>
      }

    </>
  );
}

export function EmailInput(props: InputProps) {
  let inputProps = {...props};
  inputProps.validator = props.validator === undefined ? true : props.validator;
  inputProps.title = props.title ? props.title : "Email";
  inputProps.icon = props.icon || (<MailOutlineRoundedIcon/>);
  inputProps.type = props.type ? props.type : "email";
  inputProps.placeholder = props.placeholder || "mail@site.com";
  return (
    <>
      <TextInput {...inputProps}/>
      <div className="validator-hint hidden">Enter valid email address</div>
    </>
  );
}

export function TextInput(props: InputProps) {
  return (
    <>
      <label
        className={concatStr("input", true, props.title ? "floating-label" : undefined, props.validator ? "validator" : undefined, props.className)}>
        {
          props.title ?
            <span>{props.title}</span>
            : null
        }
        {props.icon}
        <input type={props.type || "text"} placeholder={props.placeholder} name={props.name} required={props.required}
               pattern={props.pattern} title={props.tooltips} {...props.additionalProps} ref={props.ref}/>
        {props.children}
      </label>
    </>
  );
}

export function GhostTextInput(props: InputProps) {
  return (
    <>
      <input type="text" className={`input input-ghost ${props.className}`}/>
    </>
  );
}