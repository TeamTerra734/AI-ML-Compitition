import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import LoaderAnimation from "./Loader/LoaderAnimation";
import WebFont from 'webfontloader';
const AppLayout = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true); 
    const [animation, setAnimation] = useState(null);
    
    useEffect(() => {
        
        WebFont.load({
            custom: {
                families: [
                    '"Oxanium", sans-serif',
                    '"Poppins", sans-serif'
                ],
                urls: [
                    '../main.css' 
                ]
            },
            active: () => {
                setAnimation("animationStart");
                setIsLoading(false);
            }
        });
    }, []);
    useEffect(() => {
        if (location.state && location.state.action === "loading") {
            setAnimation(null);
            setIsLoading(true); 
        }
    }, [location]);
    return (
        <>
            <main style={isLoading?{overflowY:'hidden',height: '100px',width: '100px',zIndex:999}:{overflowY:'hidden',height: 'auto',width: 'auto'}} className={animation}>
            {isLoading && <LoaderAnimation />}
                <Outlet />
            </main>
        </>
    );
};

export default AppLayout;