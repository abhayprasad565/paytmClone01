import ErrorPopup from "../Components/ErrorPopup";
import { useSetRecoilState } from "recoil";
import errorPopup from "../Store/Error";
function useError() {
    const setError = useSetRecoilState(errorPopup);
    const showError = (error, message) => {
        setError(<ErrorPopup error={error} message={message} />);
        setTimeout(removeError, 2000);
    }
    const removeError = () => {
        setError();
    }
    return showError;
}
export default useError;
