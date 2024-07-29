import { Outlet } from "react-router-dom";
import MyNav from "./Component/MyNav";
import Cookies from 'js-cookie';
import '../../../css/User/user.css'
const User = () => {
    if (Cookies.get('userId') && Cookies.get('idToken')) {
        return (
            <>
            <div className="mainUser">

                <MyNav />
                <Outlet />
            </div>
            </>
        );
        // ...
    } else {
        window.location.assign("/")
    }
}
export default User;