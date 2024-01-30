import React from 'react';

const TransactionCard = ({ transaction, type }) => {
    const { balance, sender, receiver, time } = transaction;
    const transactionTime = new Date(time);
    const details = type ? `${sender.firstName + " " + sender.lastName} sent you ₹ ${balance}` :
        `You sent ₹ ${balance} to ${receiver.firstName + " " + receiver.lastName}`;
    return (
        <div className='w-full m-2 p-2 h-[50px] bg-white rounded-md border-gray-700 border flex flex-row justify-between px-6 items-center'>
            <div className='w-fit flex flex-col items-start justify-center'>
                <div className='w-fit text-xl font-semibold'>{details}</div>
                <div className='w-fit text-sm '>{transactionTime.toLocaleString('In')}</div>
            </div>
            <div className={`${type ? `text-green-700` : `text-red-700`} text-xl font-bold`}>
                {type ? '+' : '-'} ₹{balance}</div>
        </div>
    );
}

export default TransactionCard;
