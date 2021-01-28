import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./css/passwd.module.css";
import React from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

interface PasswordButtonModel {
  onShow: () => void;
  onHide: () => void;
}

const PasswordButton: React.FunctionComponent<PasswordButtonModel> = ({onHide, onShow}) => {

  const [show, setShow] = useState(false);

  const Image = useMemo(() => show ? <EyeIcon /> : <EyeOffIcon />, [show]);

  const handleClick = useCallback(() => setShow(!show), [show]);

  useEffect(() => {
    if(show) {
      onShow();
    } else {
      onHide();
    }
  },[show])

  return <div className={styles.wrapper}>
    <button className={styles.btn} onClick={handleClick}>
      {Image}
    </button>
  </div>

}

export {PasswordButton};