import {onMounted, onUnmounted, ref} from "vue";

export default function getSlideDirection(x,y){

    event.preventDefault()
    var moveEndX = event.changedTouches[0].pageX
    var moveEndY = event.changedTouches[0].pageY
    var X = moveEndX - this.startX
    var Y = moveEndY - this.startY
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
        alert('left 2 right')
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
        alert('right 2 left')
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
        alert('top 2 bottom')
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
        alert('bottom 2 top')
    } else {
        alert('just touch')
    }
    return direction;

}
