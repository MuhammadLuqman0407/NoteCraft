import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToPastes, addToPastes } from '../redux/pasteSlice';
import { toast } from 'react-hot-toast';   // ✅ import toast
import {Circle,PlusCircle,Copy} from 'lucide-react'
import { Navigate } from 'react-router-dom';

function Home() {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const pasteId = searchParams.get('pasteId');
  const allPastes = useSelector((state) => state.paste.pastes);


  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p.id === pasteId);
      setTitle(paste.title);
      setValue(paste.content);
    }
  }, [pasteId])

  function createPaste() {
    if (!value.trim()) {
      toast.error('Please enter some content!');  // ✅ use toast here
      return;
    }

    const paste = {
      title: title.trim() || "Untitled",
      content: value.trim(),
      id: pasteId || Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    

    try {
      if (pasteId) {
        // update
        dispatch(updateToPastes(paste));
        toast.success('Paste updated successfully!');

        setTitle('');
        setValue('');
        setSearchParams(); 
      }
      else {
        // create
        dispatch(addToPastes(paste));
        toast.success('Paste created successfully!');

        // reset only on create
        setTitle('');
        setValue('');
        setSearchParams();   // ✅ clears query params properly
      }
    }
    catch (error) {
      toast.error('Error creating paste: ' + error.message);
    }
  }
  const resetPate = () =>{
      setTitle("");
      setValue("");
      setSearchParams({});
  }


  return (
    <div className='w-full h-full py-2 max-w-[900px] mx-auto px-5 lg:px-0'>
      <div className='flex flex-col gap-y-2 items-start' >
        <div className='flex flex-row gap-5 place-content-between w-full'>
          <input
            className={`p-3 rounded-md mt-2 pl-5 text-white border border-input 
            ${pasteId ? 'w-[80%]' : 'w-[85%]'}`}
            type="text"
            placeholder="Enter Title Here...."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={createPaste}
            className='p-3 rounded-md mt-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 font-medium text-white min-w-[150px] w-[210px] dark:bg-blue-600 dark:hover:bg-blue-700'>
            {pasteId ? "Update Paste" : "Create Paste"}
          </button>
              {
                pasteId && <button
                    className='text-white bg-blue-700 focus:ring-4 focus: ring-blue-300 font-medium rounded-lg h-[55px] mt-[0.5rem] '
                    onClick={resetPate}
                >
                    <PlusCircle size={27}/>
                </button>
              }

        </div>

          <div className='w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)] first-letter: mt-4 min-w-[400px] p-4 bg-gray-500 mb-0 border'>
              <div className='w-full flex gap-x-[6px] items-center select-none group'>
                  <div className='w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgba(255,95,87)]'></div>
                  <div className='w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgba(254,188,46)]'></div>
                  <div className='w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgba(45,200,66)]'></div>
              </div>
              <div className='w-fit rounded-t flex items-center justify-between gap-x-4 px-'>
                  <Copy 
                    className='flex justify-center items-center transition-all duration-300 ease-in-out group'
                    onClick = {() =>{
                      navigator.clipboard.writeText(value);
                      toast.success('Copied to Clipboard',{
                         position:'top-right',
                      });
                    }}
                  />
              </div>
          </div>
          <textarea
            className='mt-[-7px] rounded min-w-[500px] text-white p-4 w-[900px] focus-visible:ring-0 resize-none '
            value={value}
            placeholder='Enter the Content here.....'
            onChange={(e) => setValue(e.target.value)}
            style={{
                caretColor: '#000'
            }}
            rows={20}
          />
        </div>
      </div>
  )
}

export default Home
