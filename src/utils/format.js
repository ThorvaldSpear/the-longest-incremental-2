import Decimal from"./break_eternity.js";import{countDecimals}from"./utils.js";const tenthousandth=new Decimal(1e-4),thousandth=new Decimal(.001),nearOne=new Decimal(.99),e3=new Decimal(1e3),e4=new Decimal(1e4),e6=new Decimal(1e6),e9=new Decimal(1e9),e36=new Decimal(1e36),ee3=new Decimal("ee3"),ee4=new Decimal("ee4"),ee6=new Decimal("ee6"),eeee1000=new Decimal("eeee1000"),standardPrefixes=["","","M","B","T","Qa","Qi","Sx","Sp","Oc","N","De"];function exponentialFormat(e,t,o=!0){let r=e.log10().floor(),a=e.div(Decimal.pow(10,r));return a.toStringWithDecimalPlaces(t)==="10"+(t>0?"."+"0".repeat(t):"")&&(a=Decimal.dOne,r=r.add(Decimal.dOne)),r=r.gte(e9)?format(r,3):r.gte(e4)?commaFormat(r,0):r.toStringWithDecimalPlaces(0),o?`${a.toStringWithDecimalPlaces(t)}e${r}`:`e${r}`}function commaFormat(e,t){if(e.lt(thousandth))return(0).toFixed(t);const o=e.toStringWithDecimalPlaces(t).split(".");return o[0]=o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,"),1===o.length?o[0]:`${o[0]}."${o[1]}`}function regularFormat(e,t){return e.toStringWithDecimalPlaces(t)}export function format(e,t=2){if(e=new Decimal(e),Decimal.isNaN(e))return"[ERROR]: NaN";if(e.lt(Decimal.dZero))return`-${format(e.neg(),t)}`;if(!e.isFinite())return"Infinity";if(e.gte(eeee1000)){const t=e.slog();return t.gte(e6)?`F${format(t.floor())}`:`${Decimal.dTen.pow(t.sub(t.floor())).toStringWithDecimalPlaces(3)}F${commaFormat(t.floor(),0)}`}if(e.gte(ee6))return exponentialFormat(e,0,!1);if(e.gte(ee4))return exponentialFormat(e,0);if(e.gte(e36))return exponentialFormat(e,Math.max(t,2));if(e.gte(e6)){const t=e.log10().floor().toNumber(),o=Math.floor(t/3);return`${e.div(Math.pow(10,3*o)).toFixed(Math.max(2-t+3*o,0))} ${standardPrefixes[o]}`}return e.gte(e3)?commaFormat(e,0):e.gte(tenthousandth)?regularFormat(e,t):e.eq(Decimal.dZero)?(0).toFixed(t):(e=invertOOM(e)).lt(ee3)?exponentialFormat(e,Math.max(t,2)).replace(/([^(?:e|F)]*)$/,"-$1"):`${format(e,t)}⁻¹`}export function formatWhole(e){return(e=new Decimal(e)).gte(e6)?format(e,3):e.lte(nearOne)&&!e.eq(Decimal.dZero)?format(e,2):format(e,0)}export function formatChange(e,t=0){const o=(e=new Decimal(e)).gt(0)?"+":"";return e.gt(10)?o+format(e,t)+"x":(e.gt(1)?"+":"")+format(e.sub(1).mul(100),t)+"%"}export function formatPrecise(e){return format(e,Math.min(countDecimals(e),5))}export function formatTime(e,t){return(e=new Decimal(e)).gte(31536e4)?format(e.div(31536e3))+"y":e.gte(31536e3)?format(e.div(31536e3).floor(),0)+"y, "+formatTime(e.mod(31536e3)):e.gte(604800)?format(e.div(604800).floor(),0)+"w, "+formatTime(e.mod(604800),"w"):e.gte(86400)||"w"===t?format(e.div(86400).floor(),0)+"d, "+formatTime(e.mod(86400),"d"):e.gte(3600)||"d"===t?(e.div(3600).gte(10)||"d"!==t?"":"0")+format(e.div(3600).floor(),0)+":"+formatTime(e.mod(3600),"h"):e.gte(60)||"h"===t?(e.div(60).gte(10)||"h"!==t?"":"0")+format(e.div(60).floor(),0)+":"+formatTime(e.mod(60),"m"):(e.gte(10)||"m"!==t?"":"0")+format(e,2)+("m"!==t?"s":"")}function invertOOM(e){const t=e.log10().ceil();return Decimal.dTen.pow(t.neg()).times(e.div(Decimal.dTen.pow(t)))}
