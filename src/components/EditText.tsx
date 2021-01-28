import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { EditTextModel, RangeValueModel } from 'src/types';
import { BlinkCursor } from './BlinkCursor';
import Character from './Char';
import styles from './css/edit.module.css';
import { PasswordButton } from './PasswdButton';
import { PlaceholderComponent } from './Placeholder';
import { RangeButton } from './RangeButton';

interface SelectionModel {
  start: number;
  end: number;
}

const EditTextComponent: React.FunctionComponent<EditTextModel> = ({
  value,
  onSaveEdit,
  cursorSize = 'SMALL',
  onChanged,
  placeholder = 'Enter a value...',
  mode,
  editable = false,
  maxLength = 20,
  isPasswordField = false,
  range,
}) => {
  const [editText, setEditText] = useState<string>(value);
  const [hasFocus, setHasFocus] = useState<boolean>();
  const ref = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<SelectionModel>({
    start: -1,
    end: -1,
  });
  const [rangeVal, setRangeVal] = useState<RangeValueModel>(
    range || { min: 0, max: 1000 },
  );

  const whiteList = useMemo(() => {
    // prepare an array to encompass all alphabets(incl uppercase)
    return (
      Array.from({ length: range ? 0 : 26 * 2 })
        .map((_, index) =>
          // set alphabet char exclude the 6 special chars that fall between the
          // lowercase and uppercase alphabets
          String.fromCharCode(index > 25 ? 65 + index + 6 : 65 + index),
        )
        // include all numerals
        .concat([...'1234567890'])
        // if the input type is range include a space character as well
        .concat(!range ? [' '] : [])
    );
  }, [JSON.stringify(range)]);

  const onSetFocus = useCallback(
    (ev: React.MouseEvent) => {
      if (!hasFocus) {
        setHasFocus(true);
      }
    },
    [hasFocus],
  );

  const onRemFocus = useCallback(() => {
    setHasFocus(false);
    setSelection({ start: -1, end: -1 });
  }, [editText]);

  const [cursorPosition, setCursorPosition] = useState(value.length - 1);

  const cursorIsAtEnd = useRef(true);
  const cursorIsAtStart = useRef(false);
  const [passMask, setPassMask] = useState<
    Partial<{ enable: boolean; character: string }>
  >({ enable: isPasswordField, character: '*' });

  const handleKeyInput = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();

      const evtKey = event.key;
      const editTextLen = editText.length;

      if (event.ctrlKey && evtKey === 'a') {
        setSelection({ start: 0, end: editText.length });
      }

      if (
        editTextLen < maxLength &&
        whiteList.some((b) => event.key === b) &&
        !event.ctrlKey
      ) {
        const val = evtKey === ' ' ? String.fromCharCode(160) : evtKey;

        if (cursorIsAtEnd.current) {
          setEditText((prev) => `${prev}${val}`);
        } else {
          setEditText((prev) => {
            const copy = [...prev];
            copy.splice(cursorPosition + 1, 0, val);
            return copy.join('');
          });
          setCursorPosition(cursorPosition + 1);
        }

        return;
      }

      switch (evtKey) {
        case 'Enter':
          if (editText) {
            onSaveEdit && onSaveEdit(editText.trim());
            onChanged && onChanged(false);
          }
          break;
        case 'Escape':
          setHasFocus(false);
          onChanged && onChanged(false);
          break;
        case 'Backspace':
          setEditText((prev) =>
            [...prev].filter((_, index) => index !== cursorPosition).join(''),
          );

          if (cursorPosition >= 0) {
            setCursorPosition(cursorPosition - 1);
          }
          break;
        case 'Home':
        case 'End':
          evtKey === 'Home'
            ? setCursorPosition(-1)
            : setCursorPosition(editTextLen - 1);

          cursorIsAtEnd.current = evtKey === 'Home';
          cursorIsAtStart.current = evtKey === 'Home';
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (evtKey === 'ArrowLeft' && cursorPosition >= -1) {
            setCursorPosition(cursorPosition - 1);
          } else if (
            evtKey === 'ArrowRight' &&
            cursorPosition < editTextLen - 1
          ) {
            setCursorPosition(cursorPosition + 1);
          }

          if (cursorPosition > 0 && cursorPosition < editTextLen) {
            cursorIsAtStart.current = false;
            cursorIsAtEnd.current = false;
          } else {
            cursorIsAtStart.current = true;
            cursorIsAtEnd.current = false;
          }

          break;
        case 'Delete':
          const { start, end } = selection;

          if (start + end > 0) {
            setSelection({ start: -1, end: -1 });
            return;
          }

          if (editTextLen && cursorPosition < editTextLen) {
            setEditText((prev) =>
              [...prev]
                .filter((_, index) => index !== cursorPosition + 1)
                .join(''),
            );
          }
          break;
      }
    },
    [editText, hasFocus, cursorPosition, selection.start, selection.end],
  );

  useEffect(() => {
    if (!editText.length) {
      setCursorPosition(-1);
    } else {
      if (cursorIsAtEnd.current) {
        setCursorPosition(editText.length - 1);
      }
    }
  }, [editText]);

  useEffect(() => {
    if (rangeVal) {
      setEditText(''+rangeVal.value);
    }
  }, [rangeVal.value]);

  const Blink = useMemo(
    () =>
      cursorPosition < 0 || hasFocus ? (
        <BlinkCursor
          hasFocus={hasFocus}
          selectAll={true}
          cursorSize={cursorSize}
          order={0}
          alignCursorLeft={cursorPosition < 0}
        />
      ) : null,
    [hasFocus, cursorPosition, editText],
  );

  const positionCursor = useCallback((position: number) => {
    setCursorPosition(position);
  }, []);

  const handleOnSelectionStarted = useCallback(
    (index) => setCursorPosition(index),
    [],
  );

  const showPassword = useCallback(
    () => setPassMask(Object.assign({}, passMask, { enable: false })),
    [],
  );

  const hidePassword = useCallback(
    () => setPassMask(Object.assign({}, passMask, { enable: true })),
    [],
  );

  const incrOrDecrRange = useCallback(
    (factor: number) => {
      const { min, max, value } = rangeVal;
      if (typeof value !== 'undefined' && value >= 0) {
        debugger;
        const newVal = Number(value) + factor;
        if (newVal >= min && newVal <= max) {
          setRangeVal((prev) => Object.assign({}, prev, { value: newVal }));
        }
      }
    },
    [rangeVal.value],
  );

  const TextView = (
    <div
      className={styles.wrapper}
      onBlur={onRemFocus}
      onKeyDown={handleKeyInput}
      tabIndex={0}
      onClick={onSetFocus}
      ref={ref}
    >
      {mode === 'INPUT' && !editText.length && (
        <PlaceholderComponent value={placeholder} onBlr={onRemFocus} />
      )}
      <span className={styles.text}>
        {cursorPosition < 0 && Blink}
        {[...editText].map((char, index) => (
          <Character
            key={index}
            onSelectionStart={handleOnSelectionStarted}
            onPositionCursor={() => positionCursor(index)}
            activeIndex={cursorPosition}
            char={char}
            cursorSize="SMALL"
            index={index}
            mask={passMask}
          />
        ))}
      </span>
      {isPasswordField && (
        <PasswordButton onShow={showPassword} onHide={hidePassword} />
      )}
      {!isPasswordField && range && (
        <RangeButton
          min={rangeVal.min}
          max={rangeVal.max}
          value={rangeVal.value || 0}
          onDecrement={incrOrDecrRange}
          onIncrement={incrOrDecrRange}
        />
      )}
    </div>
  );

  return TextView;
};

export { EditTextComponent };
