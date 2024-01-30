import React from 'react';

const UserSearchCard = ({ user, handleCLick }) => {

    return (
        <div className='w-full min-h-fit m-2 p-2 px-3  h-[50px] bg-white rounded-md border-gray-700 border flex flex-row justify-between sm:px-6 items-center'
            onClick={() => handleCLick(user.username)}>
            <div className='w-fit flex flex-col items-start justify-center'>
                <div className='w-fit text-xl font-semibold'>{user.firstName + " " + user.lastName}</div>
                <div className='w-fit text-sm '>@{user.username}</div>
            </div>
        </div>
    );
}

export default UserSearchCard;
