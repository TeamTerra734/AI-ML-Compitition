import { Outlet } from "react-router-dom";
import MyNav from "./Component/MyNav";
import Cookies from 'js-cookie';
import '../../../css/User/user.css'
const handleSignIn = async () => {

    try {
        idToken = Cookies.get('idToken')
        // Send idToken and email to Django server
        const response = await fetch('http://127.0.0.1:8000/start-session/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }), // Include email in the request body
        });

        const data = await response.json();
        console.log('Session started on Django server:', data);
        // Handle successful session start on Django server
        window.location.assign("/");
    } catch (error) {
        console.error('Error during sign-in or server communication:', error.message);
        // Handle errors here
    }

}
const User = () => {

    if (Cookies.get('userId') && Cookies.get('idToken')) {
        handleSignIn()
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