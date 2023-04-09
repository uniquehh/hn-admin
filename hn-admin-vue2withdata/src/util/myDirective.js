export default {
  hasPower(el, bind) {
    el.style.display = bind.value.includes('123')?'unset':'none'
  }
}