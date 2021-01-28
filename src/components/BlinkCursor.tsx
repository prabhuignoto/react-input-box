import React, { useMemo } from 'react';
import type { BlinkCursorModel } from 'src/types';
import styles from "./css/edit.module.css";

const BlinkCursor: React.FunctionComponent<BlinkCursorModel> = ({
  hasFocus,
  order,
  alignCursorLeft,
}) => {
  const blinkStyle = useMemo(
    () =>
      ({
        '--blink-visibility': hasFocus ? 'visibility' : 'hidden',
        '--blink-order': order,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [alignCursorLeft ? 'left' : 'right']: 0,
        minHeight: '1rem'
      } as React.CSSProperties),
    [hasFocus, order],
  );

  return <span className={styles.blink} style={blinkStyle} />;
};

export { BlinkCursor };
