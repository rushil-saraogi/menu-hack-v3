export function getTouches(evt) {
 return (
  evt.touches || // browser API
  evt.originalEvent.touches
 ); // jQuery
}
