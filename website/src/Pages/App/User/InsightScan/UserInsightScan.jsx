import ImageScanForm from "../../Components/ImageScanForm";
import { useState, useEffect } from "react";
import TitleFont from "../../Components//TitleFont";
import HeroButton from "../../Components/HeroButton";
import axios from "axios"
import Cookies from "js-cookie"
import StatusTable from "../../Components/StatusTable";
import ShowArea from "../../Components/ShowArea";
import AirIndexClassifier from "../../Components/AirIndexClassifier"
const UserInsightScan = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [formData, setFormData] = useState(null);
    // Function to check if any value in analysisData is not null
    const hasValidData = () => {
        return Object.values(analysisData).some(value => value !== null && value !== "");
    };
    useEffect(() => {
        console.log("formdata: ", formData)
    });

    const [submitLoading, setSubmitLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const myfunc = async () => {
        setSubmitLoading(true);

        const submitData = new FormData();

        // Assuming formData and analysisData are dictionaries
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(`${key}`, value);
        });

        submitData.append("prob_array", analysisData.prob_array);
        submitData.append("airPollutionProbability", analysisData.airPollutionProbability);
        submitData.append("areaClassification", analysisData.areaClassification);
        submitData.append("airQualityClassification", analysisData.airQualityClassification);
        submitData.append('idToken', Cookies.get('idToken'))

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload-insightscan-data/', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response.ok && (response.status != 200)) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setStatusMessage('Data submitted successfully!');
            // Handle success response data here
        } catch (error) {
            setStatusMessage(`Error An error occurred: ${error.message}`);
        } finally {
            setSubmitLoading(false);
        }
    };


    const handleCloseAlert = () => {
        setStatusMessage('');
    };
    return (
        <>
            <div className="container" style={{ paddingTop: "70px" }}>
                <div className="row">
                    <ImageScanForm type="UserInsightScan" resData={[analysisData, setAnalysisData]} resFormData={[formData, setFormData]} />

                    {/* Conditionally render "Insights:" if there is any valid data */}
                    { analysisData && (
                        
                        <div className="col-12 order-3">
                            <TitleFont text="Insights:" />
                            {
                            analysisData.analyziedImg && (<div className="lightblue-container">
                                <p className="Form-title" style={{ fontSize: "1rem" }}>Deforestation : <div className="color-div mx-2" style={{ backgroundColor: "red" }}></div> , <span style={{ paddingLeft: "15px" }}></span> Forestation : <div className="color-div mx-2" style={{ backgroundColor: "green" }}></div></p>
                                <div className="row g-0">
                                    <div className="col-lg-6 col-sm-6 col-sm-12" style={{ position: "relative" }}>
                                        <div className="imageAnalysisDiv mt-2" style={{ width: "80%" }}>
                                            <img src={imgURL} className="color-image" />
                                        </div>
                                        <div className="arrow-div">
                                            <svg viewBox="0 0 122 107" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M68.346 0.725525L58.7689 10.3042L101.963 53.5061L58.7689 96.6957L68.346 106.274L121.118 53.5061L68.346 0.725525Z" fill="#93DC49" fillOpacity="0.9" />
                                                <path d="M39.3338 0.725525L29.7567 10.3042L72.9512 53.5061L29.7567 96.6957L39.3338 106.274L92.0931 53.5061L39.3338 0.725525Z" fill="#93DC49" fillOpacity="0.9" />
                                                <path d="M10.3216 0.725586L0.744507 10.3043L43.9268 53.5061L0.744507 96.6958L10.3216 106.274L63.0809 53.5061L10.3216 0.725586Z" fill="#93DC49" fillOpacity="0.9" />
                                                <g style={{ mixBlendMode: 'multiply' }}>
                                                    <path d="M101.707 53.2373L101.963 53.5061L58.7688 96.6957L68.3459 106.274L121.117 53.5061L120.849 53.2373H101.707Z" fill="#E5E5E5" />
                                                    <path d="M72.6823 53.2373L72.951 53.5061L29.7566 96.6957L39.3337 106.274L92.093 53.5061L91.8364 53.2373H72.6823Z" fill="#E5E5E5" />
                                                    <path d="M43.6703 53.2373L43.9268 53.5061L0.744507 96.6957L10.3216 106.274L63.0809 53.5061L62.8121 53.2373H43.6703Z" fill="#E5E5E5" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-sm-6 col-sm-12 d-flex color-image-conatiner" >
                                        <div className="imageAnalysisDiv mt-2" style={{ width: "80%" }}>
                                            <img src={imgURL} className="color-image" />
                                        </div>
                                    </div>
                                </div>
                            </div>)
                            }
                            

                            {analysisData.prob_array && (
                                <div className="lightblue-container mt-5 ">
                                <p className="Form-title" style={{ fontSize: "1rem" }}>Deforestation Probability  table :</p>
                                <StatusTable prob_array={analysisData.prob_array} />
                            </div>
                            )}
                            
                            {
                                analysisData.areaClassification && (<ShowArea selectedCategories={analysisData.areaClassification} />)
                            }
                            
                            {
                                analysisData.airQualityClassification && (<AirIndexClassifier airQualityClassification={analysisData.airQualityClassification} />)
                            }

                            

                            {analysisData.summary !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <p className="Form-title" style={{ fontSize: "1rem" }}>Summary :</p>
                                        {analysisData.summary}
                                    </div>
                                </div>
                            )}

                            {analysisData.actions !== null && (
                                <div style={{ paddingTop: "80px" }}>
                                    <TitleFont text="Actionable Things:" />
                                    <div className="lightblue-container" style={{ fontSize: "1rem" }}>
                                        <ul>
                                            {analysisData.actions.map((item, index) => (
                                                <li key={index} className="my-3">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mb-5">
                                <HeroButton
                                    text={submitLoading ? 'Submitting...' : "Submit"}
                                    onClick={myfunc}
                                    disabled={submitLoading}
                                />
                                {statusMessage && (
                                    <div className={`alert  ${statusMessage.includes('Error') ? 'alert-danger ' : 'alert-success'} mt-3`} role="alert">
                                        {statusMessage}
                                        <button type="button" className="btn-close float-end mt-1 " onClick={handleCloseAlert} aria-label="Close"></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    
                </div>
            </div>
        </>
    );
};

export default UserInsightScan;
