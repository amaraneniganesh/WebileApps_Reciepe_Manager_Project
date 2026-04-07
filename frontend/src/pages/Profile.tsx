import React, { useEffect, useState } from 'react';
import api from '../api.ts';
import { User } from '../types';
import { FiUser } from 'react-icons/fi';

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get<User>('/auth/me');
                setProfileData(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);

    if (!profileData) return <div className="text-center mt-20 text-gray-500">Loading Profile...</div>;

    return (
        <div className="max-w-lg mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
                            {profileData.image ? (
                                <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser size={40} />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mt-1">{profileData.role}</p>
                        </div>
                    </div>

                    <hr className="border-gray-100 mb-6" />

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500">Name</span>
                            <span className="font-semibold text-gray-900">{profileData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500">Email Address</span>
                            <span className="font-semibold text-gray-900">{profileData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500">Account Role</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${profileData.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {profileData.role}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500">Account Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${profileData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {profileData.isActive ? 'Active' : 'Deactivated'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;