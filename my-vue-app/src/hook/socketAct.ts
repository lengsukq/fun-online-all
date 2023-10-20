import io from 'socket.io-client';
import {provide} from "vue";


function socketInit(){
    return  io("http://127.0.0.1:3000", {
        timeout: 5000,
    });
}
export default {socketInit}
