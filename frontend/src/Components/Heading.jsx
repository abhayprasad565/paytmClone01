import React from 'react';

const Heading = ({ text }) => {
    return (
        <>
            <div className='text-3xl w-full h-fit p-3 mx-2 font-bold text-center'>{text}</div>
        </>
    );
}

export default Heading;
