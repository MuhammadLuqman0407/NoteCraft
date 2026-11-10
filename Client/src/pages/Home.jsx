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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900 
    px-3 sm:px-6 py-6 flex justify-center">

      <div className="w-full max-w-5xl bg-zinc-900/80 backdrop-blur-xl 
      rounded-2xl shadow-2xl border border-zinc-700/50 p-4 sm:p-6">

        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row gap-3 w-full">

          <input
            type="text"
            placeholder="Paste title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full lg:flex-1 px-4 py-3 rounded-xl 
            bg-zinc-800 text-white border border-zinc-700
            focus:ring-2 focus:ring-indigo-500 outline-none
            transition placeholder:text-zinc-400"
          />

          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={createPaste}
              className="w-full lg:w-auto px-6 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-violet-600
              hover:from-indigo-500 hover:to-violet-500
              focus:ring-2 focus:ring-indigo-400 transition"
            >
              {pasteId ? "Update" : "Create"}
            </button>

            {pasteId && (
              <button
                onClick={resetPate}
                className="px-4 py-3 rounded-xl bg-zinc-800 text-white
                hover:bg-zinc-700 transition flex items-center justify-center"
              >
                <PlusCircle size={22} />
              </button>
            )}
          </div>
        </div>

        {/* Editor Header */}
        <div className="mt-5 flex items-center justify-between 
        bg-zinc-800/70 rounded-t-xl px-4 py-3 border border-zinc-700">

          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          <Copy
            className="text-zinc-300 cursor-pointer 
            hover:text-indigo-400 transition"
            onClick={() => {
              navigator.clipboard.writeText(value)
              toast.success("Copied!", { position: "top-right" })
            }}
          />
        </div>

        {/* Textarea */}
        <textarea
          rows={14}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start writing your paste..."
          className="w-full rounded-b-xl bg-zinc-800/80 text-white
          p-4 sm:p-5 border border-t-0 border-zinc-700
          resize-none outline-none
          focus:ring-2 focus:ring-indigo-500 transition
          placeholder:text-zinc-400"
        />

      </div>
    </div>
  )
}



export default Home
