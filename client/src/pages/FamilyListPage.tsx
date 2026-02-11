import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { Plus, Search, ChevronRight, MapPin, User, Trash2, Edit, Users } from 'lucide-react';

interface Family {
  _id: string;
  houseName: string;
  houseNumber: string;
  village: string;
  wardNumber: string;
  address: string;
  houseHolderOnlyName: string;
}

export default function FamilyListPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (wardFilter) params.ward = wardFilter;
      const { data } = await API.get('/families', { params });
      setFamilies(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, [wardFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFamilies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this family and all its members?')) return;
    try {
      await API.delete(`/families/${id}`);
      setFamilies((prev) => prev.filter((f) => f._id !== id));
    } catch {
      // silent
    }
  };

  const wards = [...new Set(families.map((f) => f.wardNumber))].sort();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Families</h2>
          <p className="text-slate-400 mt-1">{families.length} families registered</p>
        </div>
        <button
          onClick={() => navigate('/families/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Family
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
            placeholder="Search by name, house number, village..."
          />
        </form>
        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        >
          <option value="" className="bg-slate-900">All Wards</option>
          {wards.map((w) => (
            <option key={w} value={w} className="bg-slate-900">Ward {w}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : families.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">No families found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {families.map((family) => (
            <div
              key={family._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <Link to={`/families/${family._id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-emerald-400">{family.houseNumber}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold truncate">{family.houseName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {family.houseHolderOnlyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {family.village}
                        </span>
                        <span className="hidden sm:inline px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                          Ward {family.wardNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/families/${family._id}/edit`); }}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(family._id); }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link to={`/families/${family._id}`} className="p-2 text-slate-400 hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
