import io from 'socket.io-client';


function socketInit(){
    return  io("http://43.139.164.240:3000", {
        timeout: 5000,
    });
}
export default {socketInit}
