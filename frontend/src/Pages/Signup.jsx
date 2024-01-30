import React, { useState } from 'react';
import InputBox from '../Components/InputBox';
import FormSubmitButton from '../Components/FormSubmitButton';
import Heading from '../Components/Heading';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import errorPopup from '../Store/Error';
import fetchData from '../Hooks/ApiCall';
const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setError = useSetRecoilState(errorPopup);
    const handleSignin = async () => {
        let params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    username: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                }
            })
        }
        const res = await fetchData('/user/signup', params, setError);
        if (res != null) {
            navigate('/login', { replace: true });
        };
    }
    return (
        <div className='w-full h-[80%]  my-4 flex items-center justify-center box-border'>
            <div className='sm:w-1/3 w-full h-fit my-3 pb-4 px-16 items-center border border-md'>
                <Heading text={`Signup to Aam Pay`}></Heading>
                <div className='flex flex-row gap-1 w-full items-center justify-evenly'>
                    <InputBox label={`First Name`} type={`text`} value={firstName} change={setFirstName} />
                    <InputBox label={`Last Name`} type={`text`} value={lastName} change={setLastName} />
                </div>
                <InputBox label={`Email`} type={`email`} value={email} change={setEmail} />
                <InputBox label={`password`} type={`password`} value={password} change={setPassword} />
                <div onClick={handleSignin}><FormSubmitButton text={`Signup`} /></div>
                <div className='text-sm my-2 text-center'>Already have an Accoount? <Link className='text-green-700 hover:underline' to={`/login`}>Login</Link></div>
            </div>
        </div>
    );
}

export default Signup;
