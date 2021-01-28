import React from 'react';
import type { PlaceholderModel } from 'src/types';
import styles from "./css/placeholder.module.css";

const PlaceholderComponent: React.FunctionComponent<PlaceholderModel> = (
  props,
) => {
  return (
    <div onBlur={props.onBlr} className={styles.wrapper}>
      <span className={styles.placeholder}>{props.value}</span>
      {props.children}
    </div>
  );
};

export { PlaceholderComponent };
