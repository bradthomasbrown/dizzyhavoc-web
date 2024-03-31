/**
 * A <Which/> choice.
 * @prop {string} name the name to be shown with the choice
 * @prop {string} src base64 encoding of an image to be shown with the choice
 * @prop {string} dsrc like src, but used if dark mode is preferred
 * @prop {unknown} value the value to be returned upon a choice being picked
 * @prop {string} space the string that is used to filter this choice
 */
type Choice<T> = {
  id: string;
  src?: string;
  dsrc?: string;
  value: T;
  space?: string;
};
