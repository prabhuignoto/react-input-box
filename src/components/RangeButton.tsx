import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './css/range.module.css';
import { ChevronDown, ChevronUp } from './icons';

interface RangeButtonModel {
  min: number;
  max: number;
  value: number;
  onIncrement: (f: number) => void;
  onDecrement: (f: number) => void;
}

const RangeButton: React.FunctionComponent<RangeButtonModel> = ({
  min,
  max,
  value,
  onIncrement,
  onDecrement,
}) => {
  const disableUp = useMemo(() => value >= min, [value]);
  const disableDown = useMemo(() => value <= max, [value]);

  const buttonUpClass = useMemo(
    () => classNames([styles.button, { [styles.disable]: !disableUp }]),
    [disableUp],
  );
  const buttonDownClass = useMemo(
    () => classNames([styles.button, { [styles.disable]: !disableDown }]),
    [disableDown],
  );

  return (
    <div className={styles.wrapper}>
      <button className={buttonUpClass} onClick={() => onDecrement(-1)}>
        <ChevronUp />
      </button>
      <button className={buttonDownClass} onClick={() => onIncrement(1)}>
        <ChevronDown />
      </button>
    </div>
  );
};

export { RangeButton };
