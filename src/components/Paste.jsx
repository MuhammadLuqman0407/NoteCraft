import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromPastes } from '../redux/pasteSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from "uuid";
import { Link } from 'react-router-dom';
import { Calendar, Copy, Dice1, Eye, PencilLine, Trash2, Share2 } from 'lucide-react';
// import {forward} from 'lucide-react'
import { FormatDate } from '../utlis/formatDate'

const id = uuidv4();

const Paste = () => {

    const pastes = useSelector((state) => state.paste.pastes);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleDelete(pasteId) {
        dispatch(removeFromPastes(pasteId));
    }
    const filteredPastes = pastes.filter((paste) =>
        paste.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Add this function inside your Paste component
    const handleShare = async (paste) => {
        try {
            const shareLink = `${window.location.origin}/pastes/${paste.id}`;
            await navigator.clipboard.writeText(shareLink);
            toast.success('Share link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };
    return (
        <div className='w-full min-w-[1200px] flex flex-col gap-3 px-4 py-1 rounded-[0.3rem] border border-[rgba(235,231,231,0.51)] mt-6'>
            <input
                className='mt-2 rounded-2xl min-w-[600px] pl-7 p-4 focus:outline-none w-full bg-transparen border-gray-300'
                type='search'
                placeholder='Search Here....'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='flex flex-col border border-[rgba(128,121,121,0.3)] py-4 rounded-[0.4rem] mb-5'>
                <h1 className='font-mullish flex flex-start font-semibold px-10 py-1'> All Pastes</h1> <hr />
                <div className="w-full px-4 pt-4 flex flex-col gap-y-5">
                    {filteredPastes.length > 0 ? (
                        filteredPastes.map((paste) => (
                            <div className='border border-[rgba(128,121,121,0.3)] w-full h-[150px] gap-y-4 justify-between flex flex-col sm:flex-row p-4 rounded-[0.3rem]'
                                key={paste.id}>

                                <div className='font-mullish font-semibold pb-4 w-[50%] h-full flex flex-col space-y-3 justify-between'>
                                    <p className='text-3xl font-semibold break-words max-w-full'>{paste.title}</p>
                                    <p className='text-xl font-normal line-clamp-3 max-w-full text-[#707070]'> {paste.content}</p>

                                </div>

                                <div className='flex flex-col gap-y-4 sm:items-end h-full justify-between'>
                                    <div className='flex gap-3 flex-wrap '>
                                        <button className='p-3 rounded-[0.3rem] border hover:bg-transparent group hover:border-blue-500 w-12 h-12 flex items-center justify-center'>
                                            <Link to={`/?pasteId=${paste.id}`}>
                                                <PencilLine className='text-gray-400 group-hover:text-blue-500 border-[#686868] hover:bg-transparent' size={24} />
                                            </Link>
                                        </button>
                                        <button className='p-3 rounded-[0.3rem] border hover:bg-transparent group hover:border-orange-500 w-12 h-12 flex items-center justify-center'>
                                            <Link to={`/pastes/${paste.id}`}>
                                                <Eye className='text-gray-400 group-hover:text-orange-500' size={24} />
                                            </Link>
                                        </button>
                                        <button onClick={() => handleDelete(paste?.id)} className='p-3 rounded-[0.3rem] border hover:bg-transparent group hover:border-pink-500 w-12 h-12 flex items-center justify-center'>
                                            <Trash2 className='text-gray-400 group-hover:text-pink-500' size={24} />
                                        </button>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(paste.content)
                                            toast.success('Copied to clipboard')
                                        }} className='p-3 rounded-[0.3rem] border hover:bg-transparent group hover:border-green-500 w-12 h-12 flex items-center justify-center'>
                                            <Copy
                                                className='text-gray-400 group-hover:text-green-500' size={24} />
                                        </button>
                                        <button onClick={() => handleShare(paste)} className='p-3 rounded-[0.3rem] border hover:bg-transparent group hover:border-purple-500 w-12 h-12 flex items-center justify-center'>
                                            <Share2 className='text-gray-400 group-hover:text-purple-500' size={24} />
                                        </button>
                                    </div>
                                    <div className='gap-x-2 flex text-[24px] font-mullish font-semibold'>
                                        <Calendar className='text-gray-400' size={33} />
                                        {FormatDate(paste.createdAt)}
                                    </div>

                                </div>
                            </div>

                        ))
                    ) : (
                        <div className='text-2xl text-center w-full text-chileanFire-500'>
                            <p className='text-extrabold font-mullish font-medium'>
                                No Data Found
                            </p>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Paste