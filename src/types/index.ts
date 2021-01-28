import type { RefObject } from "react";

export interface RangeValueModel {
  min: number;
  max: number;
  value?: number;
}

export interface EditTextModel {
  cursorSize?: 'SMALL' | 'LARGE';
  editable?: boolean;
  maxLength?: number;
  mode: 'EDIT' | 'INPUT';
  onChanged?: (status: boolean) => void;
  onSaveEdit?: (value: string) => void;
  placeholder?: string;
  ref?: RefObject<HTMLDivElement>;
  showCursor?: boolean;
  value: string;
  isPasswordField?: boolean;
  range?: RangeValueModel;
}

export interface BlinkCursorModel {
  cursorSize: 'SMALL' | 'LARGE';
  hasFocus?: boolean;
  order: number;
  selectAll?: boolean;
  alignCursorLeft?: boolean;
}

export interface PlaceholderModel {
  onBlr: () => void;
  value?: string;
}