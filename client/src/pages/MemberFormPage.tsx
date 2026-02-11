import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface MemberForm {
  name: string;
  age: number;
  sex: string;
  maritalStatus: string;
  bloodGroup: string;
  education: string;
  job: string;
  madrasaEducation: string;
  relationToHouseHolder: string;
  'financial.loans': string;
  'financial.rationCard': string;
  'ids.aadhar': string;
  'ids.phone': string;
  'health.status': string;
  'health.details': string;
}

export default function MemberFormPage() {
  const { familyId, memberId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!memberId;
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MemberForm>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const healthStatus = watch('health.status');

  useEffect(() => {
    if (isEdit && memberId) {
      API.get(`/members/${memberId}`).then(({ data }) => {
        reset({
          name: data.name,
          age: data.age,
          sex: data.sex,
          maritalStatus: data.maritalStatus,
          bloodGroup: data.bloodGroup,
          education: data.education,
          job: data.job,
          madrasaEducation: data.madrasaEducation,
          relationToHouseHolder: data.relationToHouseHolder,
          'financial.loans': data.financial?.loans,
          'financial.rationCard': data.financial?.rationCard,
          'ids.aadhar': data.ids?.aadhar,
          'ids.phone': data.ids?.phone,
          'health.status': data.health?.status,
          'health.details': data.health?.details,
        });
        setFetching(false);
      }).catch(() => navigate(`/families/${familyId}`));
    }
  }, [memberId]);

  const onSubmit = async (formData: MemberForm) => {
    setLoading(true);
    const payload = {
      familyId,
      name: formData.name,
      age: Number(formData.age),
      sex: formData.sex,
      maritalStatus: formData.maritalStatus,
      bloodGroup: formData.bloodGroup,
      education: formData.education,
      job: formData.job,
      madrasaEducation: formData.madrasaEducation,
      relationToHouseHolder: formData.relationToHouseHolder,
      financial: {
        loans: formData['financial.loans'],
        rationCard: formData['financial.rationCard'],
      },
      ids: {
        aadhar: formData['ids.aadhar'],
        phone: formData['ids.phone'],
      },
      health: {
        status: formData['health.status'],
        details: formData['health.details'],
      },
    };
    try {
      if (isEdit) {
        await API.put(`/members/${memberId}`, payload);
      } else {
        await API.post('/members', payload);
      }
      navigate(`/families/${familyId}`);
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
  const selectClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(`/families/${familyId}`)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Member' : 'Add New Member'}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>Full Name *</label>
              <input {...register('name', { required: true })} className={inputClass} placeholder="Full name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className={labelClass}>Age *</label>
              <input type="number" {...register('age', { required: true })} className={inputClass} placeholder="Age" />
              {errors.age && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className={labelClass}>Sex *</label>
              <select {...register('sex', { required: true })} className={selectClass}>
                <option value="" className="bg-slate-900">Select</option>
                <option value="Male" className="bg-slate-900">Male</option>
                <option value="Female" className="bg-slate-900">Female</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
              {errors.sex && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className={labelClass}>Marital Status *</label>
              <select {...register('maritalStatus', { required: true })} className={selectClass}>
                <option value="" className="bg-slate-900">Select</option>
                <option value="Married" className="bg-slate-900">Married</option>
                <option value="Unmarried" className="bg-slate-900">Unmarried</option>
                <option value="Divorced" className="bg-slate-900">Divorced</option>
                <option value="Widowed" className="bg-slate-900">Widowed</option>
              </select>
              {errors.maritalStatus && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className={labelClass}>Blood Group</label>
              <select {...register('bloodGroup')} className={selectClass}>
                <option value="" className="bg-slate-900">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Relation to Householder *</label>
              <input {...register('relationToHouseHolder', { required: true })} className={inputClass} placeholder="e.g. Self, Wife, Son" />
              {errors.relationToHouseHolder && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
          </div>
        </div>

        {/* Education & Employment */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Education & Employment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Education</label>
              <input {...register('education')} className={inputClass} placeholder="e.g. 10th, Plus Two, Degree" />
            </div>
            <div>
              <label className={labelClass}>Job</label>
              <input {...register('job')} className={inputClass} placeholder="e.g. Teacher, Business" />
            </div>
            <div>
              <label className={labelClass}>Madrasa Education</label>
              <input {...register('madrasaEducation')} className={inputClass} placeholder="e.g. Dars, Hifz" />
            </div>
          </div>
        </div>

        {/* IDs & Financial */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">IDs & Financial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Aadhar Number</label>
              <input {...register('ids.aadhar')} className={inputClass} placeholder="12-digit Aadhar" />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input {...register('ids.phone')} className={inputClass} placeholder="Phone number" />
            </div>
            <div>
              <label className={labelClass}>Loans / Credit</label>
              <input {...register('financial.loans')} className={inputClass} placeholder="e.g. Home Loan, None" />
            </div>
            <div>
              <label className={labelClass}>Ration Card</label>
              <select {...register('financial.rationCard')} className={selectClass}>
                <option value="None" className="bg-slate-900">None</option>
                <option value="APL" className="bg-slate-900">APL</option>
                <option value="BPL" className="bg-slate-900">BPL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Health Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Health Status</label>
              <select {...register('health.status')} className={selectClass}>
                <option value="Satisfied" className="bg-slate-900">Satisfied</option>
                <option value="Cancer" className="bg-slate-900">Cancer</option>
                <option value="Kidney Disease" className="bg-slate-900">Kidney Disease</option>
                <option value="Mental" className="bg-slate-900">Mental</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>
            {(healthStatus === 'Other' || healthStatus === 'Cancer' || healthStatus === 'Kidney Disease' || healthStatus === 'Mental') && (
              <div>
                <label className={labelClass}>Health Details</label>
                <input {...register('health.details')} className={inputClass} placeholder="Describe condition" />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
