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
/**
 * 获取dom上的特定属性名称
 * 由于v-for循环出来的子元素 :data-index="index"值是一变动的
 * @param {*} el 传进来的元素
 * @param {*} name 元素的后缀 (data-index的index)
 * @param {*} val  当元素没有属性的时候,在其上加上元素
 */
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
