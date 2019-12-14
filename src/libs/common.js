/**
 * 格式化时间
 * @param page
 * @param limit
 */
export const formatter = (thistime, fmt) => {
  let $this = new Date(thistime)
  let o = {
    'M+': $this.getMonth() + 1,
    'd+': $this.getDate(),
    'h+': $this.getHours(),
    'm+': $this.getMinutes(),
    's+': $this.getSeconds(),
    'q+': Math.floor(($this.getMonth() + 3) / 3),
    'S': $this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
