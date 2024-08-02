import ImageScanForm from "../../Components/ImageScanForm";
import { useState, useEffect } from "react";
import TitleFont from "../../Components//TitleFont";
import HeroButton from "../../Components/HeroButton";
import axios from "axios"
import Cookies from "js-cookie"

const UserInsightScan = () => {
    const [analysisData, setAnalysisData] = useState({
        deforestationProbability: null,
        airPollutionProbability: null,
        areaClassification: null,
        airQualityClassification: null,
        summary: null,
        actionableItems: null
    });
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
        
        submitData.append("deforestationProbability",analysisData.deforestationProbability);
        submitData.append("airPollutionProbability",analysisData.airPollutionProbability);
        submitData.append("areaClassification",analysisData.areaClassification);
        submitData.append("airQualityClassification",analysisData.airQualityClassification);

        submitData.append('idToken',Cookies.get('idToken'))

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload-insightscan-data/', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            if (!response.ok && (response.status!=200)) {
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
                    {hasValidData() && (
                        <div className="col-12 order-3">
                            <TitleFont text="Insights:" />

                            {analysisData.deforestationProbability !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight: "5px" }}>
                                            Probability of Deforestation :
                                        </span>
                                        {parseFloat((analysisData.deforestationProbability) * 100).toFixed(2)}%
                                    </div>
                                </div>
                            )}

                            {analysisData.airPollutionProbability !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight: "5px" }}>
                                            Probability of Air Pollution :
                                        </span>
                                        {parseFloat((analysisData.airPollutionProbability) * 100).toFixed(2)}%
                                    </div>
                                </div>
                            )}

                            {analysisData.areaClassification !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight: "5px" }}>
                                            Classification of Area in Image :
                                        </span>
                                        {analysisData.areaClassification}
                                    </div>
                                </div>
                            )}

                            {analysisData.airQualityClassification !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight: "5px" }}>
                                            Classification of Air Quality :
                                        </span>
                                        {analysisData.airQualityClassification}
                                    </div>
                                </div>
                            )}

                            {analysisData.summary !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <p className="Form-title" style={{ fontSize: "1rem" }}>Summary :</p>
                                        {analysisData.summary}
                                    </div>
                                </div>
                            )}

                            {analysisData.actionableItems !== null && (
                                <div style={{ paddingTop: "80px" }}>
                                    <TitleFont text="Actionable Things:" />
                                    <div className="lightblue-container" style={{ fontSize: "1rem" }}>
                                        <ul>
                                            {analysisData.actionableItems.map((item, index) => (
                                                <li key={index}>{item}</li>
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
