import React, { useEffect, useState } from 'react';
import SearchBar from '../Components/SearchBar'
import fetchData from '../Hooks/ApiCall';
import errorPopup from '../Store/Error';
import { useSetRecoilState } from 'recoil';
import UserSearchCard from '../Components/UserSearchCard';
import SendMoneyCard from '../Components/SendMoneyCard';


const SendMoney = () => {
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [debounce, setDecounce] = useState();
    const [userList, setUserList] = useState();
    const [selectedUser, setSelectedUser] = useState(null);
    const setError = useSetRecoilState(errorPopup)
    useEffect(() => {
        clearTimeout(debounce);
        let params = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }
        const debouceTimer = setTimeout(async () => {
            const res = await fetchData(`/user/bulk?filter=${searchBoxValue}`, params, setError);
            if (res != null) setUserList(res.user);
            setSelectedUser(null);
        }, 1000);
    }, [searchBoxValue]);
    const handleCardClick = async (username) => {
        setSelectedUser(userList.find(user => user.username == username));
        setUserList(null);
    }
    return (
        <div className='w-full h-fit flex-col flex items-center justify-start my-5 px-5'>
            <div className='w-full h-fit sm:text-center text-left sm:text-xl text-lg font-bold px-2 my-2'>Transfer Money</div>
            <div className='sm:w-[80%]'><SearchBar placeholder={`Search by username or name`} value={searchBoxValue} onChange={setSearchBoxValue} /></div>
            <div className='sm:text-xl t sm:w-[80%] sm:px-4 sm:mx-8 m-2 text-left w-full'>Search Results</div>
            <div className='overflow-y-scroll overflow-x-hidden max-h-[50vh] w-full flex-col h-[80%] sm:w-[80%] p-2 px-4 m-4 mx-8 box-border bg-gray-100 border-md rounded-lg border-black-400 border-2 flex justify-between items-center'>
                {/* show all user list */}
                {userList && userList.map((user) => <UserSearchCard user={user} key={user.username} handleCLick={handleCardClick} />)}
                {selectedUser && <SendMoneyCard user={selectedUser} />}
            </div>
        </div>

    );
}

export default SendMoney;
