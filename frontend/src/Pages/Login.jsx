
import React, { useState } from 'react';
import InputBox from '../Components/InputBox';
import FormSubmitButton from '../Components/FormSubmitButton';
import Heading from '../Components/Heading';
import { Link } from 'react-router-dom';
import fetchData from '../Hooks/ApiCall';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import errorPopup from '../Store/Error';
import { useNavigate } from 'react-router-dom'
import UserInfo from '../Store/User';
import isLoggedIn from '../Store/IsLoggedIn'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setError = useSetRecoilState(errorPopup);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(UserInfo);
    const setIsLoggedIn = useSetRecoilState(isLoggedIn);
    const handleLogin = async () => {
        let params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    username: email,
                    password: password,
                }
            })
        }
        const res = await fetchData('/user/login', params, setError);
        if (res != null) {
            localStorage.setItem('token', res.token);
            setIsLoggedIn(true);
            navigate('/dashboard', { replace: true });
        };
    }
    return (
        <div className='w-full h-[80%]  my-4 flex items-center justify-center box-border'>
            <div className='sm:w-1/3 w-full h-fit my-3 pb-4 px-16 items-center border border-md'>
                <Heading text={`Login to Aam Pay`}></Heading>
                <InputBox label={`Username`} type={`text`} value={email} change={setEmail} />
                <InputBox label={`password`} type={`password`} value={password} change={setPassword} />
                <div onClick={handleLogin}><FormSubmitButton text={`Signup`} /></div>
                <div className='text-sm my-2 text-center'>New to Aam Pay? <Link className='text-green-700 hover:underline' to={`/signup`}>Signup</Link></div>
            </div>
        </div>
    );
}

export default Login;
