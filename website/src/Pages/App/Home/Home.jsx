import NavHome from "../Components/NavHome";
import HeroAnimation from "../Components/HeroAnimation";
import TitleFont from "../Components/TitleFont";
import HeroButton from "../Components/HeroButton";
import analysisImg from "./images/imageanalysis.png";
import SearchIcon from "./images/SearchIcon.png";
import eyeImg from "./images/eye.png";
import cloudImg from "./images/cloud.png";
import suggestImg from "./images/suggest.png";
import Cookies from 'js-cookie';

import { auth, GoogleAuthProvider, signInWithPopup } from "../../../firebase";

const Home = () => {
    // Example of sending token to Django server using fetch
    const handleSignIn = async () => {
        if (Cookies.get('userId') && Cookies.get('idToken')) {
            window.location.assign("/user/adddata")
        }
        else {
            const provider = new GoogleAuthProvider();
            try {
                // Sign in with Google and get the result
                const result = await signInWithPopup(auth, provider);

                // This gives you the signed-in user info
                const user = result.user;

                // Extract user information
                const idToken = await user.getIdToken();  // Get user's email address


                console.log('Signed in user:', user);
                console.log('Firebase ID Token:', idToken);

                Cookies.set('userId', user, { expires: 7 });
                Cookies.set('idToken', idToken, { expires: 7 });

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
        };
    }


    return (
        <>
            <NavHome />
            <div className="container w-100" style={{ paddingTop: "70px" }}>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <HeroAnimation />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "85%" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <div>
                                    <TitleFont text="Satellite Image Analysis" />
                                </div>

                                <div className="mt-2">
                                    <span>
                                        Our application specializes in developing AI solutions that analyze satellite imagery and IoT data to monitor and predict environmental changes, delivering actionable insights for conservation and sustainability.
                                    </span>
                                </div>
                                <div className="my-4">
                                    <HeroButton text={Cookies.get('userId') && Cookies.get('idToken') ? "Use Now" : "Login"} onClick={handleSignIn} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 order-lg-1 order-2">
                        <div className="d-flex justify-content-start align-items-center" style={{ height: "85%" }}>
                            <div className="w-100 mb-5">
                                <div className="lightblue-container sm-padding">
                                    <div className="svg-lb-container">
                                        <img src={eyeImg} />
                                    </div>
                                    Insights from images & IOT data
                                </div>
                                <div className="lightblue-container sm-padding">
                                    <div className="svg-lb-container ">
                                        <img src={cloudImg} />
                                    </div>
                                    Data monitoring and summerizing
                                </div>
                                <div className="lightblue-container sm-padding">
                                    <div className="svg-lb-container">
                                        <img src={suggestImg} />
                                    </div>
                                    Suggest actionable things
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12  order-lg-2 order-md-1 order-1">
                        <div className="d-flex justify-content-center align-items-center imageContainer" >
                            <div className="imageAnalysisDiv">
                                <img src={analysisImg} className="analysisImg" />
                                <img src={SearchIcon} className="searchicon" />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 order-3">
                        <TitleFont text="How??" />
                        <div className="my-5">
                            <span className="herobutton">
                                1.
                            </span>
                            <div className="lightblue-container" style={{ marginTop: "10px", padding: "35px" }}>
                                Here we are using multi model approach, meaning multiple data science models are used to
                                analyse the the image and IOT data. We use different ML models to get information like (1)Probability of deforestation, air pollution, (2) Classification of image into places like desert, green, river etc. (3) By Iot data categorizing air quality in good, moderate, worst, Hazardous
                                etc. models to get meaningful insights about given data
                            </div>
                        </div>
                        <div className="my-5">
                            <span className="herobutton">
                                2.
                            </span>
                            <div className="lightblue-container" style={{ marginTop: "10px", padding: "35px" }}>
                                Then by meaningful insights we can use LLM models to get textual data also we can extract other information from textual and imagery data from this LLM models
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </>
    );
}
export default Home;