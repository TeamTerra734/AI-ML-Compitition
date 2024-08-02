import NavHome from "../Components/NavHome";
import ImageScanForm from "../Components/ImageScanForm";
import { useState } from "react";
import TitleFont from "../Components/TitleFont";

const InsightScan = () => {
    const [analysisData, setAnalysisData] = useState({
        deforestationProbability: null,
        airPollutionProbability: null,
        areaClassification: null,
        airQualityClassification: null,
        summary: null,
        actionableItems: null
    });

    // Function to check if any value in analysisData is not null
    const hasValidData = () => {
        return Object.values(analysisData).some(value => value !== null && value !== "");
    };

    return (
        <>
            <NavHome />
            <div className="container" style={{ paddingTop: "70px" }}>
                <div className="row">
                    <ImageScanForm type="InsightScan" resData={[analysisData, setAnalysisData]} />

                    {/* Conditionally render "Insights:" if there is any valid data */}
                    {hasValidData() && (
                        <div className="col-12 order-3">
                            <TitleFont text="Insights:" />

                            {analysisData.deforestationProbability !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight:"5px" }}>
                                            Percentage of Deforestation :
                                        </span>
                                        {parseFloat((analysisData.deforestationProbability) * 100).toFixed(2)}%
                                    </div>
                                </div>
                            )}

                            {analysisData.airPollutionProbability !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight:"5px" }}>
                                        Percentage of Air Pollution :
                                        </span>
                                        {parseFloat((analysisData.airPollutionProbability) * 100).toFixed(2)}%
                                    </div>
                                </div>
                            )}

                            {analysisData.areaClassification !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight:"5px" }}>
                                            Classification of Area in Image : 
                                        </span>
                                        {analysisData.areaClassification}
                                    </div>
                                </div>
                            )}

                            {analysisData.airQualityClassification !== null && (
                                <div className="lightblue-container">
                                    <div>
                                        <span className="Form-title" style={{ fontSize: "1rem", paddingRight:"5px" }}>
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
                                                <li key={index} className="my-3">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InsightScan;
