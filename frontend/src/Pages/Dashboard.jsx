import React, { useEffect, useState } from 'react';
import Button from '../Components/Button';
import TransactionCard from '../Components/TransactionCard';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userInfo from '../Store/User'
import errorPopup from '../Store/Error';
import fetchData from '../Hooks/ApiCall';
const Dashboard = () => {
    const user = useRecoilValue(userInfo);
    const [accDetails, setAccDetails] = useState(null);
    const setError = useSetRecoilState(errorPopup);
    useEffect(() => {
        const getAccInfo = async () => {
            let params = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
            const res = await fetchData('/account/balance', params, setError);
            setAccDetails({ balance: res.balance, transactions: res.transactions });
        }
        getAccInfo();
    }, []);
    return (
        <div className='w-full h-fit my-5 py-2 box-border flex flex-col items-center justify-center'>
            <Link className='text-sm text-right rounded-md bg-gray-700 hover:text-black hover:bg-white hover:border-black border-2 font-bold w-fit self-end text-white sm:p-2 p-1 mx-10 sm:mx-40'>Edit User</Link>
            {/* User box */}
            <div className='h-fit w-[80%] p-2 px-4 m-4 mx-8 box-border bg-gray-100 border-md rounded-lg border-black-400 border-2 flex-col sm:flex-row justify-between items-center'>
                <div className='sm:w-fit w-full sm:text-xl text-md sm:font-bold font-semibold p-2 flex flex-col justify-start'>
                    <div className=' '>Name : {user && user.firstName + " " + user.lastName}</div>
                    <div className='  '>Username : {user && user.username}</div>
                </div>
                {/* balance */}
                <div className='flex flex-row gap-2 items-center justify-between'>
                    <div className='w-fit sm:p-6 p-2 bg-green-700 rounded-lg font-bold text-white text-sm sm:text-xl'>Balance : ₹ {accDetails && accDetails.balance} </div>
                    <div className='sm:h-fit flex sm:flex-col flex-row sm:gap-2 gap-1'>
                        <Button text={`Transfer Funds`} to={`/send`}></Button>
                        <Button text={`Add Money`} to={`/add`}></Button>
                    </div>
                </div>
            </div>
            {/* Transactions History */}
            <div className='text-xl text-left w-[80%] px-4 mx-8'>Recent Transactions</div>
            <div className='overflow-y-scroll overflow-x-hidden max-h-[50vh]  flex-col h-[80%] w-[80%] p-2 px-4 m-4 mx-8 box-border bg-gray-100 border-md rounded-lg border-black-400 border-2 flex justify-between items-center'>
                {accDetails && accDetails.transactions.map((transaction) => {
                    return <TransactionCard transaction={transaction} type={user && user.username == transaction.receiver.username} key={transaction._id}></TransactionCard>
                })}
                {accDetails && accDetails.transactions.length == 0 ? "No transactions Present" : ""}
            </div>
        </div>
    );
}

export default Dashboard;
