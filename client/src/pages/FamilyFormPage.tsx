import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface FamilyForm {
  houseName: string;
  houseNumber: string;
  village: string;
  wardNumber: string;
  address: string;
  contactNumber: string;
  houseHolderOnlyName: string;
}

export default function FamilyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FamilyForm>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/families/${id}`).then(({ data }) => {
        reset(data.family);
        setFetching(false);
      }).catch(() => navigate('/families'));
    }
  }, [id]);

  const onSubmit = async (formData: FamilyForm) => {
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/families/${id}`, formData);
        navigate(`/families/${id}`);
      } else {
        const { data } = await API.post('/families', formData);
        navigate(`/families/${data._id}`);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Family' : 'Add New Family'}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>House Name *</label>
            <input {...register('houseName', { required: true })} className={inputClass} placeholder="e.g. Thayyil House" />
            {errors.houseName && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className={labelClass}>House Number *</label>
            <input {...register('houseNumber', { required: true })} className={inputClass} placeholder="e.g. 101" />
            {errors.houseNumber && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className={labelClass}>Village *</label>
            <input {...register('village', { required: true })} className={inputClass} placeholder="e.g. Kondotty" />
            {errors.village && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className={labelClass}>Ward Number *</label>
            <input {...register('wardNumber', { required: true })} className={inputClass} placeholder="e.g. 5" />
            {errors.wardNumber && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address *</label>
            <input {...register('address', { required: true })} className={inputClass} placeholder="Full address" />
            {errors.address && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className={labelClass}>House Holder Name *</label>
            <input {...register('houseHolderOnlyName', { required: true })} className={inputClass} placeholder="Main person's name" />
            {errors.houseHolderOnlyName && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input {...register('contactNumber')} className={inputClass} placeholder="Phone number" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update Family' : 'Create Family'}
          </button>
        </div>
      </form>
    </div>
  );
}
