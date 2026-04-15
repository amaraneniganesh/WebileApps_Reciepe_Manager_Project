import React, { useEffect, useState } from 'react';
import api from '../api.ts';
import { User } from '../types';
import { FiUser, FiMail, FiLock, FiCamera, FiTrash2, FiEdit2, FiUploadCloud, FiShield, FiPower, FiXCircle } from 'react-icons/fi';

const SuperAdminPanel: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get<User[]>('/users');
      setAdmins(res.data); 
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (admin: User) => {
    setFormMode('edit');
    setEditId(admin.id);
    setName(admin.name);
    setEmail(admin.email);
    setImageUrl(admin.image || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setImageUrl(''); setImageFile(null);
    setFormMode('create'); setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    if (formMode === 'create') data.append('password', password);

    if (imageFile) data.append('image', imageFile);
    else data.append('imageUrl', imageUrl);

    try {
      if (formMode === 'create') await api.post('/users', data);
      else await api.put(`/users/${editId}`, data);
      resetForm();
      fetchAdmins();
    } catch (err: any) { alert("Operation failed"); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id: number) => {
    await api.patch(`/users/${id}/toggle`);
    fetchAdmins();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl('');
    }
  };

  const getPreview = (): string => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageUrl) return imageUrl;
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <FiShield size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-500 text-sm">Create and manage system administrators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                {formMode === 'create' ? 'Add New Admin' : 'Edit Admin Details'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden text-gray-400">
                  {getPreview() ? (
                    <img src={getPreview()} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiCamera size={28} />
                  )}
                </div>
                <div className="w-full text-center">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full justify-center">
                    <FiUploadCloud /> Upload Photo
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </label>
                  <p className="text-xs text-gray-400 my-2">or</p>
                  <input
                    type="text"
                    placeholder="Paste Image URL"
                    value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                {formMode === 'create' && (
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? 'Processing...' : (formMode === 'create' ? 'Create Administrator' : 'Save Changes')}
                </button>
                {formMode === 'edit' && (
                  <button type="button" onClick={resetForm} className="w-full mt-2 flex justify-center items-center gap-2 text-gray-500 hover:bg-gray-100 py-2 rounded-md transition">
                    <FiXCircle /> Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">System Administrators ({admins.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                    <th className="px-6 py-3">Admin Profile</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden">
                          {admin.image ? <img src={admin.image} alt={admin.name} className="w-full h-full object-cover" /> : <FiUser size={20} />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{admin.name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => toggleStatus(admin.id)} className={`p-2 rounded-md transition ${admin.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title="Toggle Status">
                          <FiPower size={16} />
                        </button>
                        <button onClick={() => handleEditClick(admin)} className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition" title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => { if (window.confirm(`Delete ${admin.name}?`)) api.delete(`/users/${admin.id}`).then(fetchAdmins); }} className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition" title="Delete">
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No administrators found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;