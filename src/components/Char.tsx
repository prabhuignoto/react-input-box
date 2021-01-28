import React, { useCallback, useRef } from 'react';
import { BlinkCursor } from './BlinkCursor';
import styles from "./css/edit.module.css";

interface CharacterModel {
  onSelectionStart: (index: number) => void;
  onPositionCursor: (index: number) => void;
  index: number;
  char: string;
  cursorSize: 'SMALL' | 'LARGE';
  activeIndex: number;
  mask?: Partial<{
    enable: boolean;
    character?: string;
  }>;
}

const Character: React.FunctionComponent<CharacterModel> = React.memo(
  ({
    onSelectionStart,
    onPositionCursor,
    index,
    char,
    cursorSize,
    activeIndex,
    mask = { enable: true, character: "#"}
  }) => {
    const charRef = useRef<HTMLDivElement>(null);

    // console.log(selection);
    // console.log(index);

    const handleMouseDown = useCallback((ev: React.MouseEvent) => {
      const target = ev.target as HTMLDivElement;
      const halfWidth = Math.round(target.clientWidth / 2);

      const mouseX = ev.clientX;
      const charX = target.getBoundingClientRect().x;

      if (Math.round(mouseX - charX) > halfWidth) {
        onSelectionStart(index);
      } else {
        onSelectionStart(index - 1);
      }
    }, []);

    return (
      <div
        className={styles['char-wrapper']}
        onMouseDown={handleMouseDown}
        ref={charRef}
      >
        <div
          className={styles.char}
        >
          {mask.enable ? mask.character : char}
        </div>
        {index === activeIndex && (
          <BlinkCursor
            hasFocus={true}
            selectAll={true}
            cursorSize={cursorSize}
            order={index + 1}
          />
        )}
      </div>
    );
  },
);

export default Character;
