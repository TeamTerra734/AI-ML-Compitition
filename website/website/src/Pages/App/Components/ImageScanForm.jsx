import React, { useState, useEffect } from 'react';
import HeroButton from "../Components/HeroButton";
import axios from "axios";


function ImageUploadForm(props) {
    var [data1, setData1] = [,];
    if (props.type == "InsightScan" || props.type == "UserInsightScan")
        [data1, setData1] = props.resData;
    var [data2, setData2] = [,];
    if (props.type == "UserInsightScan")
        [data2, setData2] = props.resFormData;

    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [iotData, setIotData] = useState({ O3: "", CO: "", NO2: "", SO2: "", AQI: "", PM2_5: "", PM10: "" });
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false); // For managing loading state

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file)); // Generate a preview URL
        } else {
            setSelectedFile(null);
            setImageUrl('');
            alert('Please select a valid image file.');
        }
    };

    const handleImageUrlChange = async (event) => {
        const url = event.target.value;
        setImageUrl(url);
        setSelectedFile(null);

        if (url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching image from URL: ${response.statusText}`);
                }
                const blob = await response.blob();
                const file = new File([blob], 'image.jpg', { type: blob.type });
                setSelectedFile(file);
                setImageUrl(URL.createObjectURL(blob));
            } catch (error) {
                setStatusMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleIotDataChange = (event) => {
        const { id, value } = event.target;
        setIotData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };
    const sendData = async () => {
        setData1({
            deforestationProbability: null,
            airPollutionProbability: null,
            areaClassification: null,
            airQualityClassification: null,
            summary: null,
            actionableItems: null
        });
        if (props.type == "UserInsightScan")
            setData2(null);
        if (location && date && (selectedFile)) {
            setLoading(true); // Disable button and show loader
            setStatusMessage(""); // Clear previous status message

            const formData = new FormData();
            formData.append('date', date);
            formData.append('location', location);

            // Append selected file if available
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            // Append IoT data
            Object.keys(iotData).forEach(key => {
                if (iotData[key]) {
                    formData.append(key, iotData[key]);
                }
            });

            // Debugging: Log FormData contents
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            try {
                const response = await axios.post('http://127.0.0.1:8000/insight-scan-prediction/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data.data);

                if (response.data) {
                    setStatusMessage('Data submitted successfully!');
                    setData1({
                        "deforestationProbability": response.data.data.deforestationProbability,
                        "airPollutionProbability":response.data.data.airPollutionProbability,
                        "areaClassification": response.data.data.areaClassification,
                        "airQualityClassification": response.data.data.airQualityClassification,
                        "summary":  response.data.data.summary,
                        "actionableItems": response.data.data.actions
                    }
                    )
                } else {
                    setStatusMessage(`Error: ${response.statusText}`);
                    
                    if (props.type == "UserInsightScan")
                        setData2({
                            "date": `${date}`,
                            "location": `${location}`,
                            "file": `${selectedFile}`, // This is a placeholder. Actual file data will be binary.
                            "O3": `${iotData.O3}`,
                            "CO": `${iotData.CO}`,
                            "NO2": `${iotData.NO2}`,
                            "SO2": `${iotData.SO2}`,
                            "AQI": `${iotData.AQI}`,
                            "PM2_5": `${iotData.PM2_5}`,
                            "PM10": `${iotData.PM10}`
                        });


                }
            } catch (error) {
                setStatusMessage('An error occurred while submitting the data.');
            } finally {
                setLoading(false); // Re-enable button
            }
        }
        else {
            setStatusMessage(`Error: Image, Date and Location are rquired`);
        }
    };




    const myfunc = () => {
        if (props.type == "InsightScan" || props.type == "UserInsightScan")
            sendData();
        else if (props.type == "submitData")
            submitData();


    }
    const handleCloseAlert = () => {
        setStatusMessage('');
    };

    const [formData, setFormData] = useState({});

    const submitData = async () => {
        console.log("submitData function called"); // Debugging
    
        if (location && date && selectedFile) {
            console.log('Location:', location);
            console.log('Date:', date);
            console.log('Selected File:', selectedFile);
            
            setFormData({
                "date": `${date}`,
                "location": `${location}`,
                "file": selectedFile, // This is a file object
                "O3": `${iotData.O3}`,
                "CO": `${iotData.CO}`,
                "NO2": `${iotData.NO2}`,
                "SO2": `${iotData.SO2}`,
                "AQI": `${iotData.AQI}`,
                "PM2_5": `${iotData.PM2_5}`,
                "PM10": `${iotData.PM10}`
            });
    
            setLoading(true);
    
            const formDataToSubmit = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'file') {
                    console.log('Appending file:', value); // Debugging
                    formDataToSubmit.append(key, value);
                } else {
                    console.log(`Appending ${key}: ${value}`); // Debugging
                    formDataToSubmit.append(key, value);
                }
            });
          console.log(formDataToSubmit)
            // Log FormData entries
            for (let pair of formDataToSubmit.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
    
            try {
                console.log(formDataToSubmit)
                const response = await axios.post('http://127.0.0.1:8000/upload-singular-data/', formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (!response.data) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = response.data;
                setStatusMessage('Data submitted successfully!');
                // Handle success response data here
            } catch (error) {
                console.error('Error during data submission:', error);
                setStatusMessage(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        } else {
            setStatusMessage('Error: Image, Date, and Location are required');
        }
    };
    





    return (
        <>
            <div className="col-lg-6 col-md-12 col-sm-12 order-lg-1 order-md-2 order-2">
                <div className="d-flex justify-content-start align-items-center imageContainer">
                    <div className="imageAnalysisDiv">
                        <img src={imageUrl} alt="Upload the image" style={{ objectFit: "contain" }} className="analysisImg" />
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 order-lg-2 order-md-1 order-1">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <div className='lightblue-container center_container'>
                        <form style={{ width: "100%" }}>
                            <span className='Form-title'>Imagery Data:</span>
                            <svg viewBox="0 0 30 34" className='compulsorySVG' fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="30" height="26.8085" rx="2.55319" fill="#283880" />
                                <path d="M20.9157 7.84256L22.3863 10.4979L16.708 12.8672L22.4272 15.1957L20.8748 17.9328L15.9319 14.3379L16.5855 20.5064H13.5216L14.1344 14.3379L9.19143 17.9736L7.59824 15.1957L13.2765 12.8264L7.59824 10.5387L9.10973 7.80171L14.1753 11.4374L13.5216 5.22809H16.6263L15.9319 11.4374L20.9157 7.84256Z" fill="#93DC49" fillOpacity="0.9" />
                            </svg>
                            <div className="form-group my-3">
                                <label htmlFor="imageUpload" className='pb-2'>Upload Image :</label>
                                <input type="file" className="form-control" id="imageUpload" onChange={handleImageUpload} accept="image/*" />
                            </div>
                            <div className="form-group my-3">
                                <input
                                    type="text"
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={handleImageUrlChange}
                                    className="form-control"
                                    placeholder='Image Link'
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="date" className='pb-2' style={{ display: "block" }}>Other Data :</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    className="form-control"
                                    style={{ width: "47.5%", display: "inline-block" }}
                                />
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={handleLocationChange}
                                    className="form-control"
                                    placeholder="Location"
                                    style={{ width: "47.5%", display: "inline-block", float:"right" }}
                                />
                            </div>
                            <p className='Form-title' style={{ marginTop: "40px" }}>IOT Data:</p>
                            <div className="form-group my-3">

                                <input
                                    type="number"
                                    id="O3"
                                    value={iotData.O3}
                                    onChange={handleIotDataChange}
                                    placeholder="O3"
                                    className="form-control"
                                    style={{ width: "21%", display: "inline-block" }}
                                />
                                <input
                                    type="number"
                                    id="CO"
                                    value={iotData.CO}
                                    onChange={handleIotDataChange}
                                    className="form-control"
                                    placeholder="CO"
                                    style={{ width: "21%", display: "inline-block", marginLeft: "5%" }}
                                />
                                <input
                                    type="number"
                                    id="NO2"
                                    value={iotData.NO2}
                                    onChange={handleIotDataChange}
                                    placeholder="NO2"
                                    className="form-control"
                                    style={{ width: "21%", display: "inline-block", marginLeft: "5%" }}
                                />
                                <input
                                    type="number"
                                    id="SO2"
                                    value={iotData.SO2}
                                    onChange={handleIotDataChange}
                                    className="form-control"
                                    placeholder="SO2"
                                    style={{ width: "21%", display: "inline-block", marginLeft: "5%" }}
                                />
                            </div>
                            <div className="form-group my-3 mb-5">
                                <input
                                    type="number"
                                    id="AQI"
                                    value={iotData.AQI}
                                    onChange={handleIotDataChange}
                                    className="form-control"
                                    placeholder="AQI"
                                    style={{ width: "21%", display: "inline-block" }}
                                />
                                <input
                                    type="number"
                                    id="PM2_5"
                                    value={iotData.PM2_5}
                                    onChange={handleIotDataChange}
                                    className="form-control"
                                    placeholder="PM2.5"
                                    style={{ width: "21%", display: "inline-block", marginLeft: "5%" }}
                                />
                                <input
                                    type="number"
                                    id="PM10"
                                    value={iotData.PM10}
                                    onChange={handleIotDataChange}
                                    className="form-control"
                                    placeholder="PM10"
                                    style={{ width: "21%", display: "inline-block", marginLeft: "5%" }}
                                />
                            </div>
                            <HeroButton
                                text={loading ? 'Submitting...' : props.type=='submitData' ? "Submit" : "Enter"}
                                onClick={myfunc}
                                disabled={loading}
                            />

                            {/* Bootstrap Alert Messages */}
                            {statusMessage && (
                                <div className={`alert  ${statusMessage.includes('Error') ? 'alert-danger ' : 'alert-success'} mt-3`} role="alert">
                                    {statusMessage}
                                    <button type="button" className="btn-close float-end mt-1 " onClick={handleCloseAlert} aria-label="Close"></button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImageUploadForm;
