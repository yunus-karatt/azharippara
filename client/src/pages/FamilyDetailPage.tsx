import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { ArrowLeft, Plus, Edit, Trash2, User, Heart, Phone, CreditCard, BookOpen } from 'lucide-react';

interface Family {
  _id: string;
  houseName: string;
  houseNumber: string;
  village: string;
  wardNumber: string;
  address: string;
  contactNumber: string;
  houseHolderOnlyName: string;
}

interface Member {
  _id: string;
  name: string;
  age: number;
  sex: string;
  maritalStatus: string;
  bloodGroup: string;
  education: string;
  job: string;
  madrasaEducation: string;
  relationToHouseHolder: string;
  financial: { loans: string; rationCard: string };
  ids: { aadhar: string; phone: string };
  health: { status: string; details: string };
}

export default function FamilyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/families/${id}`);
        setFamily(data.family);
        setMembers(data.members);
      } catch {
        navigate('/families');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Delete this member?')) return;
    try {
      await API.delete(`/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch { /* silent */ }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Satisfied': return 'text-emerald-400 bg-emerald-500/10';
      case 'Cancer': return 'text-red-400 bg-red-500/10';
      case 'Kidney Disease': return 'text-amber-400 bg-amber-500/10';
      case 'Mental': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-orange-400 bg-orange-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!family) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/families')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{family.houseName}</h2>
          <p className="text-slate-400 text-sm">House #{family.houseNumber} · Ward {family.wardNumber}</p>
        </div>
        <button
          onClick={() => navigate(`/families/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Family Info Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-500">House Holder</span>
            <p className="text-white font-medium mt-0.5">{family.houseHolderOnlyName}</p>
          </div>
          <div>
            <span className="text-slate-500">Village</span>
            <p className="text-white font-medium mt-0.5">{family.village}</p>
          </div>
          <div>
            <span className="text-slate-500">Address</span>
            <p className="text-white font-medium mt-0.5">{family.address}</p>
          </div>
          <div>
            <span className="text-slate-500">Contact</span>
            <p className="text-white font-medium mt-0.5">{family.contactNumber || '—'}</p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Members ({members.length})</h3>
        <button
          onClick={() => navigate(`/families/${id}/members/new`)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <User className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No members added yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {members.map((member) => (
            <div key={member._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{member.name}</h4>
                      <p className="text-slate-400 text-xs">{member.relationToHouseHolder} · {member.age} yrs · {member.sex}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getHealthColor(member.health?.status || 'Satisfied')}`}>
                      {member.health?.status || 'Satisfied'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>{member.maritalStatus} · {member.bloodGroup || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>{member.education || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ration: {member.financial?.rationCard || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-green-400" />
                      <span>{member.ids?.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-slate-500">Job:</span>
                      <span>{member.job || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                  <button
                    onClick={() => navigate(`/families/${id}/members/${member._id}/edit`)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
