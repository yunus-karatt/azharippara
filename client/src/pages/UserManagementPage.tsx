import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, Shield, User, X, Save, Loader2 } from 'lucide-react';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const openCreate = () => {
    setEditingUser(null);
    reset({ name: '', email: '', password: '', role: 'staff' });
    setShowForm(true);
  };

  const openEdit = (user: UserItem) => {
    setEditingUser(user);
    reset({ name: user.name, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const onSubmit = async (formData: UserForm) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        const payload: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) payload.password = formData.password;
        await API.put(`/users/${editingUser._id}`, payload);
      } else {
        await API.post('/users', formData);
      }
      setShowForm(false);
      fetchUsers();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { /* silent */ }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">Access Denied</p>
        <p className="text-slate-500 text-sm mt-1">Only admins can manage users</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 mt-1">Manage users and their roles</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input {...register('name', { required: true })} className={inputClass} placeholder="Full name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" {...register('email', { required: true })} className={inputClass} placeholder="Email address" />
                {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className={labelClass}>Password {editingUser ? '(leave blank to keep)' : '*'}</label>
                <input type="password" {...register('password', { required: !editingUser })} className={inputClass} placeholder="••••••••" />
                {errors.password && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className={labelClass}>Role *</label>
                <select {...register('role', { required: true })} className={inputClass}>
                  <option value="staff" className="bg-slate-900">Staff</option>
                  <option value="admin" className="bg-slate-900">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-all text-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <div key={u._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/[0.07] transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-slate-400 text-sm">{u.email}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {u.role}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(u._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
