import { atom } from 'recoil';
const isLoggedIn = atom({
    key: 'isLoggesIn',
    default: false
})
export default isLoggedIn;