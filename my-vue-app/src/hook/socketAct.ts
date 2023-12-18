import io from 'socket.io-client';


function socketInit(){
    return  io("http://10.147.18.216:3030", {
        timeout: 5000,
    });
}
export default {socketInit}
