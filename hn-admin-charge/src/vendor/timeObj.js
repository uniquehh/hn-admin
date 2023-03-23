export default function setDate(date){
  let curDate = new Date(date);
  let y = curDate.getFullYear();
  let m = curDate.getMonth() + 2;//本身就得+1才等于当前月份，然而我要计算下一个月，所以直接+2
  if( m > 12 ){
      m = 1;
      y++ 
  }
  let d = curDate.getDate()
  let monthLastDay = new Date(y, m, d-1).getDate();
  let b = y + '-' + (m < 10 ? '0'+m : m) + '-' + (monthLastDay < 10 ? '0'+monthLastDay : monthLastDay) + " " + "23:59:59";
  return b
}
