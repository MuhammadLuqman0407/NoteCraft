import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPastes = useSelector((state) => state.paste.pastes);
  const paste = allPastes.find((p) => p.id === id);

  // Handle case where paste doesn't exist
  useEffect(() => {
    if (!paste) {
      navigate('/404', { replace: true });
    }
  }, [paste, navigate]);

  if (!paste) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-row gap-5 place-content-between">
        <input
          className="p-3 rounded-xl bg-slate-900 border border-slate-700 w-full text-slate-100 font-medium"
          type="text"
          placeholder="Enter Title Here...."
          value={paste.title || ''}
          disabled
        />
      </div>
      <div>
        <textarea
          className="w-full rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-200 outline-none"
          value={paste.content || ''}
          placeholder="Enter the Content here....."
          disabled
          rows={16}
        />
      </div>
    </div>
  );
}

export default ViewPaste;
