import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Form, Alert, Container, Spinner, Button } from 'react-bootstrap';
import TitleFont from "../../Components/TitleFont"; // Adjust path if necessary
import HeroButton from "../../Components/HeroButton";
import ImageUploadForm from '../../Components/ImageScanForm';
import axios from "axios"
import Cookies from "js-cookie"
const ExcelToJson = () => {
    const [jsonOutput, setJsonOutput] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const convertExcelDate = (excelDate) => {
        const utcDays = Math.floor(excelDate - 25569);
        const utcValue = utcDays * 86400; // 86400 seconds in a day
        const date = new Date(utcValue * 1000); // Convert seconds to milliseconds
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    const onDrop = useCallback((acceptedFiles) => {
        setLoading(true);
        setSuccess(null);
        setError(null);
        // Retrieve the idToken from cookies
        const idToken = Cookies.get('idToken');
        const processFile = (file) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: null });

                // Validate and convert data
                const validatedData = jsonData.map((row) => ({
                    date: row.date ? (typeof row.date === 'number' ? convertExcelDate(row.date) : row.date) : null,
                    location: row.location || null,
                    link: row.link || null,
                    O3: row.O3 || null,
                    CO: row.CO || null,
                    NO2: row.NO2 || null,
                    SO2: row.SO2 || null,
                    AQI: row.AQI || null,
                    PM2_5: row.PM2_5 || null,
                    PM10: row.PM10 || null,
                    idToken:idToken
                }));

                const invalidRows = validatedData.filter(
                    (row) => !row.date || !row.location || !row.link
                );

                if (invalidRows.length > 0) {
                    setError('The file contains rows with missing date, location, or link.');
                    setJsonOutput([]);
                } else {
                    setError(null);
                    setJsonOutput((prevData) => [...prevData, ...validatedData]);
                    setSuccess('Files successfully loaded!');
                    console.log(validatedData)
                }

                setLoading(false);
            };

            reader.readAsArrayBuffer(file);
        };

        // Validate file types
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        const invalidFiles = acceptedFiles.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setLoading(false);
            setError('Invalid file type. Please upload an .xlsx or .xls file.');
            return;
        }

        acceptedFiles.forEach(file => processFile(file));
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload-excel-data/', jsonOutput, {
                headers: {
                     'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setSuccess('Data successfully submitted!');
                setJsonOutput([]);
            } else {
                const errorText = await response.text();
                setError(`Failed to submit data ${errorText}`);
            }
        } catch (err) {
            setError('Failed to submit data. Please try again.');
            console.log("Error", err)
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xlsx,.xls', multiple: true });

    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <Container style={{ paddingTop: "70px" }}>
            <div className='my-5'>
                <TitleFont text="Excel File :" />
                <Form className='mb-3'>
                    <div
                        {...getRootProps({
                            className: 'dropzone border border-2 rounded p-3 d-flex justify-content-center align-items-center bg-light',
                            style: { cursor: "pointer" }
                        })}
                    >
                        <input
                            {...getInputProps()}
                            className="form-control-plaintext"
                            style={{ display: 'none' }} // Hide the default input
                        />
                        <p className='text-center mb-0' style={{ color: "#000000" }}>
                            Drag 'n' drop Excel files here, or click to select files
                        </p>
                    </div>
                </Form>
                <HeroButton
                    text="Submit"
                    onClick={handleSubmit}
                    disabled={jsonOutput.length === 0 || loading} // Disable until JSON data is present and not loading
                />

                {error && (
                    <Alert variant="danger" className="mt-4">
                        {error}
                        <button
                            type="button"
                            className="btn-close float-end mt-1"
                            onClick={handleCloseAlert}
                            aria-label="Close"
                        ></button>
                    </Alert>
                )}
                {loading && (
                    <div className="mt-4 text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                )}
                {success && (
                    <Alert variant="success" className="mt-4">
                        {success}
                        <button
                            type="button"
                            className="btn-close float-end mt-1"
                            onClick={handleCloseAlert}
                            aria-label="Close"
                        ></button>
                    </Alert>
                )}

            </div>
            <p className='betweenOR'>OR</p>
            <div className='mb-2 mt-5'>
                <TitleFont text="Singular Data : " />
                <div className='row' style={{ paddingTop: "0" }}>
                    <ImageUploadForm type="submitData" />
                </div>
            </div>
        </Container>

    );
};

export default ExcelToJson;
