// 这里写一些dom操作的通用方法
// el,dom对象
/**
 * @param {*} el dom 对象
 * @param {*} className
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * @export 如果已经有,className需要一个方法判断是否存在className
 * @param {any} el
 * @param {any} className
 * 1. 使用正则判断
 */
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
