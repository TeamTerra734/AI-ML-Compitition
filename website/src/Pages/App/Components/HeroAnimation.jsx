
import EarthSVG from "../Home/images/Earth.svg"
import EarthSVGPhone from "../Home/images/Earthphone.svg"
import Satelliteimg from "../Home/images/Satellite.png"
const HeroAnimation = () => {
    return (
        <>
            <div className="d-flex heroimg_column">
                <div className="heroimg_container align-self-center ">
                    <img src={EarthSVG} className="Earthsvg" />
                    <img src={EarthSVGPhone} className="Earthsvg phone-earthimg" />
                </div>
            </div>
            <div className="d-flex heroimg_column myfix" style={{ position: "absolute", top: "70px" }}>
                <div className="heroimg_container align-self-center">
                    <div className="Earthsvg rotate_container myfix2" style={{ borderRadius: "100%" }} ><img src={Satelliteimg} className="rotating-image" /></div>
                </div>

            </div>

        </>
    );
}
export default HeroAnimation;