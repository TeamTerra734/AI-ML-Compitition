import React from 'react';
import './LoaderAnimation.css';

const LoaderAnimation = () => {
    
    return (
        <>
            <div className='body'>
                <div className="content">
                    <div className="bars">
                        {[...Array(7)].map((_, i) => (
                            <div className="bar" key={i}></div>
                        ))}
                    </div>
                    <div className="bars">
                        {[...Array(7)].map((_, i) => (
                            <div className="bar" key={i}></div>
                        ))}
                    </div>
                </div>
                <h3>Loading...</h3>
            </div>
        </>

    );
};

export default LoaderAnimation;
