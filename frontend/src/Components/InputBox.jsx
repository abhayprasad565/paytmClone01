import React from 'react';

const InputBox = ({ label, type, value, change }) => {
    return (
        <>
            <div className='my-3'>
                <label className='relative'>
                    <input type={type} className='w-full h-[40px] p-2 border-2 rounded-lg border-opacity-50 outline-none focus:border-green-500
                transition duration-200
                peer' placeholder={label} value={value} onChange={(e) => change(e.target.value)} />
                    <span className='peer-placeholder-shown:text-md bg-white -translate-y-5 text-black peer-placeholder-shown:text-opacity-80 px-2 mx-2 absolute left-0 top-0 transition duration-200
                peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 text-sm  peer-focus:text-opacity-100'>{label}</span>
                </label>
            </div>
        </>
    );
}

export default InputBox;
