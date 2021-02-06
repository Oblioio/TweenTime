/**
 * if browser supports webp, get path to webp, replace
 * img_path extension with .webp
 */
export default (img_path) => {
  if (document.documentElement.classList.contains('webp')) {
    return `${img_path.split('.')[0]}.webp`;
  }

  return img_path;
}