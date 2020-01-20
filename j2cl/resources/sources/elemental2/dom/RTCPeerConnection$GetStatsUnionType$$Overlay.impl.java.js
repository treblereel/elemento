goog.module('elemental2.dom.RTCPeerConnection.GetStatsUnionType.$Overlay$impl');

const $Util = goog.require('nativebootstrap.Util$impl');

let RTCStatsReport_$Overlay = goog.forwardDeclare('elemental2.dom.RTCStatsReport.$Overlay$impl');
let $Overlay = goog.forwardDeclare('elemental2.promise.Promise.$Overlay$impl');
let Js = goog.forwardDeclare('jsinterop.base.Js$impl');
let $Casts = goog.forwardDeclare('vmbootstrap.Casts$impl');

class GetStatsUnionType_$Overlay {
 /**
  * @param {*} o
  * @return {?}
  * @public
  */
 static m_of__java_lang_Object(o) {
  GetStatsUnionType_$Overlay.$clinit();
  return /**@type {?} */ (Js.m_cast__java_lang_Object(o));
 }
 /**
  * @param {?} $thisArg
  * @return {Promise<RTCStatsReport>}
  * @public
  */
 static m_asPromise__$devirt__elemental2_dom_RTCPeerConnection_GetStatsUnionType($thisArg) {
  GetStatsUnionType_$Overlay.$clinit();
  return /**@type {Promise<RTCStatsReport>} */ ($Casts.$to(Js.m_cast__java_lang_Object($thisArg), $Overlay));
 }
 /**
  * @param {?} $thisArg
  * @return {RTCStatsReport}
  * @public
  */
 static m_asRTCStatsReport__$devirt__elemental2_dom_RTCPeerConnection_GetStatsUnionType($thisArg) {
  GetStatsUnionType_$Overlay.$clinit();
  return /**@type {RTCStatsReport} */ (Js.m_cast__java_lang_Object($thisArg));
 }
 /**
  * @param {?} $thisArg
  * @return {boolean}
  * @public
  */
 static m_isPromise__$devirt__elemental2_dom_RTCPeerConnection_GetStatsUnionType($thisArg) {
  GetStatsUnionType_$Overlay.$clinit();
  return $Overlay.$isInstance(/**@type {*} */ ($thisArg));
 }
 /**
  * @public
  */
 static $clinit() {
  GetStatsUnionType_$Overlay.$clinit = () =>{};
  GetStatsUnionType_$Overlay.$loadModules();
 }
 /**
  * @public
  */
 static $loadModules() {
  $Overlay = goog.module.get('elemental2.promise.Promise.$Overlay$impl');
  Js = goog.module.get('jsinterop.base.Js$impl');
  $Casts = goog.module.get('vmbootstrap.Casts$impl');
 }
 
}

exports = GetStatsUnionType_$Overlay; 
//# sourceMappingURL=RTCPeerConnection$GetStatsUnionType$$Overlay.js.map