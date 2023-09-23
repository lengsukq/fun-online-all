import io from 'socket.io-client';


function socketInit(){
    return  io("http://127.0.0.1:3000", {
        timeout: 5000,
    });
}
function mountedAct(){

}
export default {socketInit,mountedAct}
