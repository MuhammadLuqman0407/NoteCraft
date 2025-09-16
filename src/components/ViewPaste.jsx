import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromPastes } from '../redux/pasteSlice'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

function ViewPaste() {
   const {id} = useParams();
   const navigate = useNavigate();
   const allPastes = useSelector((state) => state.paste.pastes);
   const paste = allPastes.filter((p)=> p.id === id)[0];

   // Handle case where paste doesn't exist
   useEffect(() => {
     if (!paste) {
       navigate('/404', { replace: true });
     }
   }, [paste, navigate]);

   // Show loading or redirect if paste doesn't exist
   if (!paste) {
     return null; // This will be replaced by the redirect
   }

  return (
   <div>
        <div className='flex flex-row gap-5 place-content-between'>
          <input 
            className='p-2 rounded-md mt-2 w-[100%] pl-5'
            type="text"
            placeholder='Enter Title Here....'
            value={paste.title || ''} disabled
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='mt-5'>
          <textarea
            className='rounded-md mt-0 min-w-[500px] p-4 border-gray-500'
            value={paste.content || ''}
            placeholder='Enter the Content here.....' disabled
            onChange={(e) => setValue(e.target.value)}
            rows={20}
          />
        </div>
   </div>
  )
}

export default ViewPaste