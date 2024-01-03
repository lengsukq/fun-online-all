import io from 'socket.io-client';


function socketInit(){
    return  io(`${import.meta.env.VITE_API}`, {
        timeout: 5000,
    });
}
export default {socketInit}
