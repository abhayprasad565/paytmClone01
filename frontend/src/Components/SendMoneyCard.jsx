import React, { useState } from 'react';
import InputBox from './InputBox';
import Button from './Button'
import fetchData from '../Hooks/ApiCall';
import { useSetRecoilState } from 'recoil';
import errorPopup from '../Store/Error';
import { useNavigate } from 'react-router-dom'

const SendMoneyCard = ({ user }) => {
    const [amount, setAmount] = useState(0);
    const setError = useSetRecoilState(errorPopup);
    const navigate = useNavigate();
    const handleSendMoney = () => {
        let params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                amount: amount,
                receiverId: user.username
            })
        }
        const res = fetchData('/account/transfer', params, setError);
        console.log(res);
    }
    return (
        <div className="rounded-xl border border-white-700 bg-gray-700 sm:w-[50%] p-4">
            <div className="flex items-center gap-4">
                <img
                    alt="Developer"
                    src="https://images.unsplash.com/photo-1614644147724-2d4785d69962?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"
                    className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                    <h3 className="text-lg font-medium text-white">{user.firstName + " " + user.lastName}</h3>
                    <div className="flow-root">
                        <ul className="-m-1 flex flex-wrap">
                            <li className="p-1 leading-none">
                                <div className="text-xs font-medium text-gray-300"> @{user.username} </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ul className="mt-4 space-y-2">
                <li className='text-white'>
                    You are Sending Money to  @{user.username}
                </li>
                <li>
                    <InputBox label={`Enter Amount`} type={`Number`} />
                </li>

                <li>
                    <div className='w-full items-center flex justify-center' onClick={handleSendMoney}>
                        <Button text={`Send Money`}></Button>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default SendMoneyCard;
