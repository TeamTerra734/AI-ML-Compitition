import { useState, useEffect } from "react";
import classifier from "../InsightScan/images/classifier.png";

const AIC = ({ airQualityClassification }) => {
    const [category, setCategory] = useState({ name: "", color: "", rotate: "" });
    const [value, setValue] = useState("");

    useEffect(() => {
        if (airQualityClassification === "Good") {
            setCategory({ name: "Good", color: "green", rotate: "15deg" });
            setValue("0-50");
        } else if (airQualityClassification === "Moderate") {
            setCategory({ name: "Moderate", color: "yellow", rotate: "45deg" });
            setValue("51-100");
        } else if (airQualityClassification === "Unhealthy_for_Sensitive_Groups") {
            setCategory({ name: "Unhealthy for sensitive groups", color: "orange", rotate: "75deg" });
            setValue("101-151");
        } else if (airQualityClassification === "Unhealthy") {
            setCategory({ name: "Unhealthy", color: "red", rotate: "105deg" });
            setValue("151-200");
        } else if (airQualityClassification === "Very_Unhealthy") {
            setCategory({ name: "Very Unhealthy", color: "purple", rotate: "135deg" });
            setValue("201-300");
        } else if (airQualityClassification === "Severe") {
            setCategory({ name: "Hazardous", color: "maroon", rotate: "165deg" });
            setValue("Above 300");
        } else {
            setCategory({ name: "Unknown", color: "gray", rotate: "0deg" });
            setValue("-");
        }
    }, [airQualityClassification]);

    return (
        <div className="lightblue-container" style={{ position: "relative" }}>
            <p className="Form-title" style={{ fontSize: "1rem" }}>
                Air quality index: {category.name}  
                <div className="color-div mx-2" style={{ backgroundColor: category.color }}></div>
                , <span style={{ marginLeft: "10px" }}></span>Air Index: {value}
            </p>
            <div className="AQI_image_div mt-4">
                <div className="AQI_image">
                    <div className="classifier_hand" style={{ transform: `rotate(${category.rotate})` }}></div>
                    <img src={classifier} alt="Classifier" style={{ height: "100%" }} />
                </div>
            </div>
        </div>
    );
};

export default AIC;
