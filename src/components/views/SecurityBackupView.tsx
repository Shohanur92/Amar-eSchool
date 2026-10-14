import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, SchoolSettings, SmsGatewayConfig, ClassroomRoom, SchoolInfrastructure, SchoolGalleryImage } from '../../types';
import { defaultInfrastructure } from '../../services/mockData';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  ShieldCheck,
  Cloud,
  Download,
  Upload,
  UserPlus,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Lock,
  HardDrive,
  Users,
  Settings,
  AlertTriangle,
  FileJson,
  Building,
  Building2,
  Mail,
  Phone,
  Image,
  MessageSquare,
  Radio,
  Send,
  Eye,
  EyeOff,
  School,
  Check,
  Sparkles,
  Printer,
  Plus,
  Trash2,
  Edit,
  Layers,
  MapPin
} from 'lucide-react';

export const SecurityBackupView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    smsConfig,
    updateSmsConfig,
    sendSms,
    classes,
    syncState,
    triggerDriveSync,
    exportDatabaseBackup,
    restoreDatabaseBackup,
    toggleOnlineSimulator,
    resetAllData,
    galleryImages,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile_logo' | 'infrastructure' | 'gallery' | 'sms_api' | 'users' | 'backup'>('profile_logo');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Gallery Management State
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState<Omit<SchoolGalleryImage, 'id'>>({
    title: '',
    category: 'campus',
    imageUrl: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [galleryFilter, setGalleryFilter] = useState<string>('all');

  // School profile form
  const [profileForm, setProfileForm] = useState<SchoolSettings>(settings);

  // Infrastructure & Room Inventory State
  const [infraForm, setInfraForm] = useState<SchoolInfrastructure>(
    settings.infrastructure || defaultInfrastructure
  );
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState<ClassroomRoom>({
    id: '',
    roomNo: '১০৫',
    name: 'শ্রেণি কক্ষ',
    type: 'classroom',
    floor: 'নিচতলা',
    capacity: 40,
    benchCount: 14,
    fanCount: 4,
    lightCount: 4,
    condition: 'good',
  });
  const [roomFilter, setRoomFilter] = useState<string>('all');

  // SMS API form
  const [smsApiForm, setSmsApiForm] = useState<SmsGatewayConfig>(smsConfig);
  const [testMobile, setTestMobile] = useState('01711223344');
  const [isTestingSms, setIsTestingSms] = useState(false);


  // New Teacher User Form (Super admin creating teachers)
  const [newUserForm, setNewUserForm] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'class_teacher',
    assignedClass: classes[2]?.id || 'c_1',
    assignedSection: 'ক',
    pin: '123456',
    is2FAEnabled: false,
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, logoUrl: dataUrl }));
      updateSettings({ logoUrl: dataUrl });
      setSuccessMsg('বিদ্যালয়ের লোগো সফলভাবে আপলোড ও আপডেট করা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Handle Signature Upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, signatureUrl: dataUrl }));
      updateSettings({ signatureUrl: dataUrl });
      setSuccessMsg('প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Handle Head Teacher Photo Upload
  const handleHeadTeacherPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৩ মেগাবাইট হতে পারবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, headTeacherPhoto: dataUrl }));
      updateSettings({ headTeacherPhoto: dataUrl });
      setSuccessMsg('প্রধান শিক্ষকের পোর্ট্রেট ছবি সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(profileForm);
    setSuccessMsg('বিদ্যালয় প্রোফাইল ও প্রধান শিক্ষকের বাণী সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Infrastructure & Room Inventory Handlers
  const handleSaveInfrastructure = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = { ...settings, infrastructure: infraForm };
    updateSettings(updated);
    setSuccessMsg('বিদ্যালয় অবকাঠামো ও কক্ষ বিবরণী সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomForm({
      id: `rm_${Date.now()}`,
      roomNo: String(100 + (infraForm.rooms?.length || 0) + 1),
      name: 'শ্রেণি কক্ষ',
      type: 'classroom',
      floor: 'নিচতলা',
      capacity: 40,
      benchCount: 14,
      fanCount: 4,
      lightCount: 4,
      condition: 'good',
    });
    setIsAddRoomOpen(true);
  };

  const handleOpenEditRoom = (room: ClassroomRoom) => {
    setEditingRoomId(room.id);
    setRoomForm(room);
    setIsAddRoomOpen(true);
  };

  const handleSaveRoomModal = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedRooms: ClassroomRoom[];
    if (editingRoomId) {
      updatedRooms = (infraForm.rooms || []).map((r) =>
        r.id === editingRoomId ? roomForm : r
      );
    } else {
      updatedRooms = [...(infraForm.rooms || []), { ...roomForm, id: `rm_${Date.now()}` }];
    }
    const updatedInfra = { ...infraForm, rooms: updatedRooms, totalRooms: updatedRooms.length };
    setInfraForm(updatedInfra);
    updateSettings({ ...settings, infrastructure: updatedInfra });
    setIsAddRoomOpen(false);
    setSuccessMsg('কক্ষ বিবরণী সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('আপনি কি নিশ্চিতভাবে এই কক্ষের বিবরণ মুছে ফেলতে চান?')) {
      const updatedRooms = (infraForm.rooms || []).filter((r) => r.id !== roomId);
      const updatedInfra = { ...infraForm, rooms: updatedRooms, totalRooms: updatedRooms.length };
      setInfraForm(updatedInfra);
      updateSettings({ ...settings, infrastructure: updatedInfra });
      setSuccessMsg('কক্ষটি তালিকা থেকে মুছে ফেলা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  // Gallery Handlers
  const handleOpenAddGallery = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      title: '',
      category: 'campus',
      imageUrl: '',
      caption: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddGalleryOpen(true);
  };

  const handleOpenEditGallery = (img: SchoolGalleryImage) => {
    setEditingGalleryId(img.id);
    setGalleryForm({
      title: img.title,
      category: img.category,
      imageUrl: img.imageUrl,
      caption: img.caption || '',
      date: img.date || new Date().toISOString().split('T')[0],
    });
    setIsAddGalleryOpen(true);
  };

  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৪ মেগাবাইট হতে পারবে!');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setGalleryForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGalleryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) {
      alert('অনুগ্রহ করে একটি ছবি নির্বাচন বা ইমেজ লিংক প্রদান করুন!');
      return;
    }
    if (editingGalleryId) {
      updateGalleryImage(editingGalleryId, galleryForm);
      setSuccessMsg('গ্যালারির ছবির তথ্য সফলভাবে হালনাগাদ করা হয়েছে!');
    } else {
      addGalleryImage(galleryForm);
      setSuccessMsg('নতুন ছবি সফলভাবে বিদ্যালয়ের ফটো গ্যালারিতে যুক্ত হয়েছে!');
    }
    setIsAddGalleryOpen(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteGallery = (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${title}" ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?`)) {
      deleteGalleryImage(id);
      setSuccessMsg('ছবিটি গ্যালারি থেকে মুছে ফেলা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  // SMS API Save
  const handleSaveSmsApi = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmsConfig(smsApiForm);
    setSuccessMsg('এসএমএস গেটওয়ে এপিআই (SMS API Gateway) সফলভাবে কনফিগার করা হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleTestSmsSend = async () => {
    if (!testMobile) return;
    setIsTestingSms(true);
    const testMsg = `[${profileForm.name}] টেস্ট এসএমএস: আপনার বিদ্যালয় এসএমএস এপিআই গেটওয়ে (${smsApiForm.provider.toUpperCase()}) সফলভাবে সংযুক্ত হয়েছে।`;
    await sendSms(testMobile, 'টেস্ট ব্যবহারকারী', testMsg, 'notice');
    setTimeout(() => {
      setIsTestingSms(false);
      setSuccessMsg(`টেস্ট এসএমএস সফলভাবে ${testMobile} নম্বরে প্রেরণ সম্পন্ন হয়েছে!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
  };


  // Create Teacher
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    addUser({
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone || '০১৭১১-XXXXXX',
      role: newUserForm.role as any,
      assignedClass: newUserForm.assignedClass,
      assignedSection: newUserForm.assignedSection || 'ক',
      pin: newUserForm.pin || '123456',
      is2FAEnabled: !!newUserForm.is2FAEnabled,
    });

    setIsAddUserOpen(false);
    setSuccessMsg(`শিক্ষক "${newUserForm.name}" এর লগইন অ্যাকাউন্ট তৈরি হয়েছে!`);
    setTimeout(() => setSuccessMsg(''), 3500);

    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'class_teacher',
      assignedClass: classes[2]?.id || 'c_1',
      assignedSection: 'ক',
      pin: '123456',
      is2FAEnabled: false,
    });
  };

  const handleSyncDrive = () => {
    setIsSyncingDrive(true);
    triggerDriveSync();
    setTimeout(() => {
      setIsSyncingDrive(false);
      setSuccessMsg('Google Drive এ সম্পূর্ণ ডাটাবেস সফলভাবে এনক্রিপ্ট করে ব্যাকআপ সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = restoreDatabaseBackup(content);
      if (ok) {
        setSuccessMsg('ডাটাবেস ব্যাকআপ থেকে সফলভাবে রিস্টোর সম্পন্ন হয়েছে!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('ফাইলটি সঠিক ব্যাকআপ ফাইল নয়!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>নিরাপত্তা, লোগো, এসএমএস এপিআই ও ক্লাউড সিঙ্ক</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বিদ্যালয়ের লোগো আপলোড, SMS API ইন্টিগ্রেশন, সুপার অ্যাডমিন নিয়ন্ত্রণ ও ক্লাউড ব্যাকআপ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncDrive}
            disabled={isSyncingDrive}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
          >
            <Cloud className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
            <span>{isSyncingDrive ? 'ড্রাইভ সিঙ্ক হচ্ছে...' : 'Google Drive এ ব্যাকআপ'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('profile_logo')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profile_logo'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>বিদ্যালয় প্রোফাইল ও লোগো আপলোড</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'infrastructure'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>বিদ্যালয় অবকাঠামো ও কক্ষ বিবরণী</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'gallery'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>ফটো গ্যালারি ব্যবস্থাপনা</span>
        </button>

        <button
          onClick={() => setActiveTab('sms_api')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sms_api'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>এসএমএস এপিআই (SMS API Gateway)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>শিক্ষক ও অ্যাডমিন অ্যাকাউন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'backup'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>অফলাইন/অনলাইন সিঙ্ক ও ব্যাকআপ</span>
        </button>
      </div>

      {/* TAB 1: SCHOOL PROFILE & LOGO UPLOAD */}
      {activeTab === 'profile_logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo and Signature Upload Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>বিদ্যালয়ের অফিশিয়াল লোগো</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সকল রসিদ, প্রবেশপত্র, প্রত্যয়ন ও নোটিশে এই লোগোটি দৃশ্যমান হবে
              </p>
            </div>

            <div className="text-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 bg-white shadow-md mb-3 flex items-center justify-center">
                {profileForm.logoUrl ? (
                  <img src={profileForm.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-4xl">🏫</span>
                )}
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-600/20 transition-all">
                <Upload className="w-4 h-4" />
                <span>লোগো আপলোড করুন (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-2">সর্বোচ্চ সাইজ: ২ মেগাবাইট (স্বচ্ছ PNG বাঞ্ছনীয়)</p>
            </div>

            {/* Signature Upload */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">সার্টিফিকেট ও প্রবেশপত্রে ব্যবহারের জন্য</p>

              <div className="flex items-center gap-3">
                <div className="w-20 h-10 border border-slate-300 dark:border-slate-700 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                  {profileForm.signatureUrl ? (
                    <img src={profileForm.signatureUrl} alt="Signature" className="max-h-full" />
                  ) : (
                    <span className="font-signature font-bold text-slate-700 text-xs">Motiur</span>
                  )}
                </div>

                <label className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer">
                  <span>স্বাক্ষর আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* School Details Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>বিদ্যালয় বিবরণী ও প্রাতিষ্ঠানিক তথ্য</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">বিদ্যালয়ের নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">School Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.nameEn}
                    onChange={(e) => setProfileForm({ ...profileForm, nameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">EIIN / EMIS কোড *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.code}
                    onChange={(e) => setProfileForm({ ...profileForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">প্রতিষ্ঠিত সাল</label>
                  <input
                    type="text"
                    value={profileForm.established}
                    onChange={(e) => setProfileForm({ ...profileForm, established: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Head Teacher Section with Custom Bani */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>প্রধান শিক্ষকের পরিচিতি ও অফিশিয়াল বাণী (পাবলিক পোর্টালে প্রদর্শিত হবে)</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                    কাস্টমাইজেশন
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">প্রধান শিক্ষকের নাম *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.headTeacherName}
                      onChange={(e) => setProfileForm({ ...profileForm, headTeacherName: e.target.value })}
                      placeholder="যেমন: মো: মতিউর রহমান"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">পদবী / ডেজিগনেশন</label>
                    <input
                      type="text"
                      value={profileForm.headTeacherDesignation || 'প্রধান শিক্ষক'}
                      onChange={(e) => setProfileForm({ ...profileForm, headTeacherDesignation: e.target.value })}
                      placeholder="যেমন: প্রধান শিক্ষক / অধ্যক্ষ"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                {/* Head Teacher Photo Upload & Preview */}
                <div className="flex items-center gap-3 p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-emerald-100 dark:border-slate-700">
                  <div className="w-14 h-14 rounded-xl border-2 border-emerald-500 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {profileForm.headTeacherPhoto ? (
                      <img src={profileForm.headTeacherPhoto} alt="Head Teacher" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👨‍🏫</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      প্রধান শিক্ষকের পোর্ট্রেট ছবি
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeadTeacherPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom Head Teacher Message / Bani */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      প্রধান শিক্ষকের বাণী (Message from Head Teacher) *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(profileForm.headTeacherMessage || '').length} অক্ষর
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.headTeacherMessage || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, headTeacherMessage: e.target.value })}
                    placeholder="প্রধান শিক্ষকের বাণী এখানে লিখুন... যেমন: সুশিক্ষা জাতির মেরুদণ্ড। আদর্শ নাগরিক হিসেবে শিক্ষার্থীদের গড়ে তুলতে পাঠ্যপুস্তকের পাশাপাশি আমরা নৈতিক শিক্ষা..."
                    className="w-full p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-medium"
                  ></textarea>
                  <p className="text-[10px] text-slate-500 mt-1">
                    💡 এই বাণীটি পাবলিক লগআউট পেজের ওয়েলকাম সেকশনে "প্রধান শিক্ষকের বাণী" কার্ডে সরাসরি প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">অফিসিয়াল ইমেইল</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">যোগাযোগের মোবাইল</label>
                  <input
                    type="text"
                    value={profileForm.contactNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">বিদ্যালয়ের পূর্ণাঙ্গ ঠিকানা</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Check className="w-4 h-4" />
                <span>প্রধান শিক্ষকের বাণী ও বিদ্যালয় প্রোফাইল সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1.5: SCHOOL INFRASTRUCTURE & ROOM DIRECTORY */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          {/* Infrastructure Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট তলা</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {toBanglaNumber(infraForm.totalFloors)} তলা
                </h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট সক্রিয় কক্ষ</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {toBanglaNumber(infraForm.rooms?.length || infraForm.totalRooms)} টি
                </h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট আসন ক্ষমতা</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {toBanglaNumber((infraForm.rooms || []).reduce((acc, r) => acc + (r.capacity || 0), 0))} জন
                </h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট টয়লেট/স্যানিটেশন</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {toBanglaNumber((infraForm.sanitationBoys || 0) + (infraForm.sanitationGirls || 0) + (infraForm.sanitationTeachers || 0))} টি
                </h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* General Infrastructure Details Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>বিদ্যালয় অবকাঠামো সাধারণ তথ্য</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  সরকারি মানদণ্ড
                </span>
              </div>

              <form onSubmit={handleSaveInfrastructure} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ভবনের ধরন ও বিবরণ *
                  </label>
                  <input
                    type="text"
                    required
                    value={infraForm.buildingType || ''}
                    onChange={(e) => setInfraForm({ ...infraForm, buildingType: e.target.value })}
                    placeholder="যেমন: পাকা বহুতল ভবন (২ তলা)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মোট তলা সংখ্যা *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={infraForm.totalFloors || 1}
                      onChange={(e) => setInfraForm({ ...infraForm, totalFloors: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মোট কক্ষ সংখ্যা *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={infraForm.rooms?.length || infraForm.totalRooms || 1}
                      onChange={(e) => setInfraForm({ ...infraForm, totalRooms: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    খেলার মাঠের পরিমাপ ও বিবরণ
                  </label>
                  <input
                    type="text"
                    value={infraForm.playGroundSize || ''}
                    onChange={(e) => setInfraForm({ ...infraForm, playGroundSize: e.target.value })}
                    placeholder="যেমন: ৬০ শতাংশ (সবুজ ঘাসের মাঠ)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    id="boundaryCheck"
                    checked={infraForm.hasBoundaryWall}
                    onChange={(e) => setInfraForm({ ...infraForm, hasBoundaryWall: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="boundaryCheck" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    বিদ্যালয়ে সীমানা প্রাচীর (Boundary Wall) বিদ্যমান রয়েছে
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    নিরাপদ খাবার পানির উৎস
                  </label>
                  <input
                    type="text"
                    value={infraForm.drinkingWaterSource || ''}
                    onChange={(e) => setInfraForm({ ...infraForm, drinkingWaterSource: e.target.value })}
                    placeholder="যেমন: গভীর নলকূপ ও আর্সেনিকমুক্ত ফিল্টার"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Sanitation Section */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    স্যানিটেশন ও টয়লেট সংখ্যা
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">ছাত্রদের</label>
                      <input
                        type="number"
                        min={0}
                        value={infraForm.sanitationBoys || 0}
                        onChange={(e) => setInfraForm({ ...infraForm, sanitationBoys: parseInt(e.target.value) || 0 })}
                        className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">ছাত্রীদের</label>
                      <input
                        type="number"
                        min={0}
                        value={infraForm.sanitationGirls || 0}
                        onChange={(e) => setInfraForm({ ...infraForm, sanitationGirls: parseInt(e.target.value) || 0 })}
                        className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">শিক্ষকদের</label>
                      <input
                        type="number"
                        min={0}
                        value={infraForm.sanitationTeachers || 0}
                        onChange={(e) => setInfraForm({ ...infraForm, sanitationTeachers: parseInt(e.target.value) || 0 })}
                        className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিদ্যুৎ ও আইপিএস ব্যাকআপ স্ট্যাটাস
                  </label>
                  <input
                    type="text"
                    value={infraForm.electricityStatus || ''}
                    onChange={(e) => setInfraForm({ ...infraForm, electricityStatus: e.target.value })}
                    placeholder="যেমন: সক্রিয় পল্লী বিদ্যুৎ সংযোগ ও আইপিএস ব্যাকআপ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইন্টারনেট ও ব্রডব্যান্ড সংযোগ স্ট্যাটাস
                  </label>
                  <input
                    type="text"
                    value={infraForm.internetStatus || ''}
                    onChange={(e) => setInfraForm({ ...infraForm, internetStatus: e.target.value })}
                    placeholder="যেমন: ওয়াইফাই ব্রডব্যান্ড ইন্টারনেট (১০ Mbps)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>অবকাঠামো তথ্য সংরক্ষণ করুন</span>
                </button>
              </form>
            </div>

            {/* Room Directory & Inventory List */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>বিদ্যালয়ের কক্ষ বিবরণী ও সরঞ্জাম ইনভেন্টরি</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    মোট কক্ষ: {toBanglaNumber(infraForm.rooms?.length || 0)} টি | বেঞ্চ, ফ্যান, লাইট ও অবস্থা
                  </p>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>প্রিন্ট</span>
                  </button>

                  <button
                    onClick={handleOpenAddRoom}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন কক্ষ যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Room Type Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold no-print">
                {[
                  { id: 'all', label: 'সকল কক্ষ' },
                  { id: 'classroom', label: 'শ্রেণিকক্ষ' },
                  { id: 'office', label: 'অফিস' },
                  { id: 'lab', label: 'কম্পিউটার ল্যাব' },
                  { id: 'library', label: 'লাইব্রেরি' },
                  { id: 'teachers_room', label: 'শিক্ষক মিলনায়তন' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRoomFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      roomFilter === f.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Room List Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="p-2.5 text-center">কক্ষ নং</th>
                      <th className="p-2.5">কক্ষের নাম ও ব্যবহার</th>
                      <th className="p-2.5">তলা</th>
                      <th className="p-2.5 text-center">ধারণক্ষমতা</th>
                      <th className="p-2.5 text-center">সরঞ্জাম (বেঞ্চ/ফ্যান/লাইট)</th>
                      <th className="p-2.5 text-center">অবস্থা</th>
                      <th className="p-2.5 text-right no-print">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(infraForm.rooms || [])
                      .filter((r) => roomFilter === 'all' || r.type === roomFilter)
                      .map((room) => {
                        const typeBadgeMap: Record<string, { label: string; color: string }> = {
                          classroom: { label: 'শ্রেণিকক্ষ', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
                          office: { label: 'অফিস', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
                          lab: { label: 'ডিজিটাল ল্যাব', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
                          library: { label: 'লাইব্রেরি', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
                          teachers_room: { label: 'শিক্ষক মিলনায়তন', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
                          common: { label: 'কমন রুম', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
                          storage: { label: 'স্টোর রুম', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
                        };
                        const badge = typeBadgeMap[room.type] || { label: 'অন্যান্য', color: 'bg-slate-100 text-slate-800' };

                        return (
                          <tr key={room.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-2.5 text-center font-mono font-black text-emerald-600 dark:text-emerald-400">
                              {toBanglaNumber(room.roomNo)}
                            </td>
                            <td className="p-2.5">
                              <strong className="block text-slate-900 dark:text-white font-bold">{room.name}</strong>
                              <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${badge.color}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-400 font-medium">
                              {room.floor}
                            </td>
                            <td className="p-2.5 text-center font-bold text-slate-800 dark:text-slate-200">
                              {toBanglaNumber(room.capacity)} জন
                            </td>
                            <td className="p-2.5 text-center text-slate-600 dark:text-slate-400">
                              <span title="বেঞ্চ সংখ্যা">🪑 {toBanglaNumber(room.benchCount)}</span> |{' '}
                              <span title="ফ্যান সংখ্যা">💨 {toBanglaNumber(room.fanCount)}</span> |{' '}
                              <span title="লাইট সংখ্যা">💡 {toBanglaNumber(room.lightCount)}</span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  room.condition === 'good'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : room.condition === 'moderate'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                }`}
                              >
                                {room.condition === 'good' ? 'ভালো' : room.condition === 'moderate' ? 'মাঝারি' : 'মেরামতযোগ্য'}
                              </span>
                            </td>
                            <td className="p-2.5 text-right no-print">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditRoom(room)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  title="কক্ষ তথ্য সম্পাদনা"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  title="কক্ষ মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setIsAddRoomOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingRoomId ? 'কক্ষ বিবরণী পরিবর্তন ও সম্পাদনা' : 'নতুন কক্ষ যুক্ত করুন'}
                </h3>
                <p className="text-xs text-slate-500">
                  কক্ষের নম্বর, ব্যবহার ও সরঞ্জামের বিবরণ পূরণ করুন
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveRoomModal} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কক্ষ নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    value={roomForm.roomNo}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNo: e.target.value })}
                    placeholder="যেমন: ১০৫ বা ২০১"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কক্ষের তলা / ফ্লোর *
                  </label>
                  <select
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="নিচতলা">নিচতলা</option>
                    <option value="২য় তলা">২য় তলা</option>
                    <option value="৩য় তলা">৩য় তলা</option>
                    <option value="৪র্থ তলা">৪র্থ তলা</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কক্ষের নাম বা ব্যবহার *
                </label>
                <input
                  type="text"
                  required
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="যেমন: শ্রেণি কক্ষ - ৩য় শ্রেণি / প্রধান শিক্ষকের অফিস"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যবহারের ধরন *
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="classroom">শ্রেণিকক্ষ (Classroom)</option>
                    <option value="office">অফিস কক্ষ (Office)</option>
                    <option value="lab">কম্পিউটার/বিজ্ঞান ল্যাব (Lab)</option>
                    <option value="library">লাইব্রেরি ও বুক কর্নার</option>
                    <option value="teachers_room">শিক্ষক মিলনায়তন</option>
                    <option value="common">কমন রুম</option>
                    <option value="storage">স্টোর রুম</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ধারণক্ষমতা (জন)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Inventories in room */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  কক্ষের সরঞ্জাম গণনা
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">বেঞ্চ সংখ্যা</label>
                    <input
                      type="number"
                      min={0}
                      value={roomForm.benchCount}
                      onChange={(e) => setRoomForm({ ...roomForm, benchCount: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">সিলিং ফ্যান</label>
                    <input
                      type="number"
                      min={0}
                      value={roomForm.fanCount}
                      onChange={(e) => setRoomForm({ ...roomForm, fanCount: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">লাইট/বাতি</label>
                    <input
                      type="number"
                      min={0}
                      value={roomForm.lightCount}
                      onChange={(e) => setRoomForm({ ...roomForm, lightCount: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কক্ষের সার্বিক অবস্থা
                </label>
                <select
                  value={roomForm.condition}
                  onChange={(e) => setRoomForm({ ...roomForm, condition: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="good">ভালো (Good Condition)</option>
                  <option value="moderate">মাঝারি (Moderate)</option>
                  <option value="needs_repair">মেরামতযোগ্য (Needs Repair)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingRoomId ? 'পরিবর্তন সংরক্ষণ করুন' : 'কক্ষ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1.6: SCHOOL PHOTO GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-600" />
                <span>বিদ্যালয় ফটো গ্যালারি ও চিত্রশালা ব্যবস্থাপনা</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                পাবলিক ওয়েবসাইটে প্রদর্শিত মূল ক্যাম্পাস, শ্রেণিকক্ষ, কম্পিউটার ল্যাব ও বার্ষিক অনুষ্ঠানের ছবি পরিচালনা করুন
              </p>
            </div>

            <button
              onClick={handleOpenAddGallery}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন ছবি যুক্ত করুন</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {[
              { id: 'all', label: `সকল ছবি (${galleryImages.length})` },
              { id: 'campus', label: 'ক্যাম্পাস' },
              { id: 'classroom', label: 'শ্রেণিকক্ষ' },
              { id: 'lab', label: 'কম্পিউটার ল্যাব' },
              { id: 'sports', label: 'বার্ষিক ক্রীড়া' },
              { id: 'cultural', label: 'সাংস্কৃতিক' },
              { id: 'other', label: 'অন্যান্য' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setGalleryFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  galleryFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Gallery Admin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryImages
              .filter((g) => galleryFilter === 'all' || g.category === galleryFilter)
              .map((img) => (
                <div
                  key={img.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group"
                >
                  <div className="w-full h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {img.category === 'campus'
                        ? 'ক্যাম্পাস'
                        : img.category === 'classroom'
                        ? 'শ্রেণিকক্ষ'
                        : img.category === 'lab'
                        ? 'কম্পিউটার ল্যাব'
                        : img.category === 'sports'
                        ? 'বার্ষিক ক্রীড়া'
                        : img.category === 'cultural'
                        ? 'সাংস্কৃতিক'
                        : 'অন্যান্য'}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-3 leading-relaxed">
                        {img.caption || img.title}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Google Drive সংরক্ষিত</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditGallery(img)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-emerald-600" />
                          <span>ক্যাপশন এডিট</span>
                        </button>

                        <button
                          onClick={() => handleDeleteGallery(img.id, img.caption || img.title)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>মুছুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add / Edit Gallery Modal */}
      {isAddGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setIsAddGalleryOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingGalleryId ? 'গ্যালারির ছবির তথ্য সম্পাদনা' : 'নতুন ছবি যুক্ত করুন'}
                </h3>
                <p className="text-xs text-slate-500">
                  পাবলিক পোর্টালের ফটো গ্যালারিতে প্রদর্শনের জন্য ছবি ও বিবরণ দিন
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveGalleryModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছবির শিরোনাম / নাম *
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরষ্কার বিতরণ ২০২৬"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="campus">মূল ক্যাম্পাস ভবন</option>
                    <option value="classroom">শ্রেণিকক্ষ ও পাঠদান</option>
                    <option value="lab">কম্পিউটার/বিজ্ঞান ল্যাব</option>
                    <option value="sports">বার্ষিক ক্রীড়া ও প্রতিযোগিতা</option>
                    <option value="cultural">সাংস্কৃতিক অনুষ্ঠান ও সমাবেশ</option>
                    <option value="other">অন্যান্য কার্যক্রম</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    value={galleryForm.date || ''}
                    onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2 p-3.5 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  ছবি নির্বাচন করুন (ডিভাইস থেকে আপলোড বা ওয়েব লিংক) *
                </span>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-24 h-24 rounded-xl border-2 border-emerald-500 overflow-hidden bg-white dark:bg-slate-800 shrink-0 flex items-center justify-center">
                    {galleryForm.imageUrl ? (
                      <img src={galleryForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Image className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                        <span className="text-[9px] block">প্রিভিউ নেই</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>গ্যালারি বা ক্যামেরা থেকে ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">বা লিংক:</span>
                      <input
                        type="url"
                        value={galleryForm.imageUrl}
                        onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছবির ক্যাপশন ও সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={galleryForm.caption || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="ছবি সম্পর্কিত একটি ছোট ক্যাপশন লিখুন যা পাবলিক গ্যালারিতে দেখাবে..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddGalleryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingGalleryId ? 'পরিবর্তন সংরক্ষণ করুন' : 'গ্যালারিতে যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SMS API GATEWAY CONFIGURATION */}
      {activeTab === 'sms_api' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Status & Balance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  এসএমএস গেটওয়ে ব্যালেন্স
                </h4>
                <p className="text-xs text-slate-500">অনলাইন সংযোগ সক্রিয়</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-900 text-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                অবশিষ্ট এসএমএস
              </span>
              <div className="text-3xl font-black font-mono">
                {toBanglaNumber(smsApiForm.balance)} <span className="text-sm font-normal">টি</span>
              </div>
              <p className="text-[11px] text-purple-200">
                প্রোভাইডার: {smsApiForm.provider.toUpperCase()} ({smsApiForm.isMasking ? 'মাস্কিং' : 'নন-মাস্কিং'})
              </p>
            </div>

            {/* Test SMS Sender Tool */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                টেস্ট এসএমএস পাঠিয়ে যাচাই করুন
              </span>
              <input
                type="text"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleTestSmsSend}
                disabled={isTestingSms}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTestingSms ? 'প্রেরণ হচ্ছে...' : 'টেস্ট এসএমএস পাঠান'}</span>
              </button>
            </div>
          </div>

          {/* SMS Gateway API Settings Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              <span>এসএমএস প্রোভাইডার ও এপিআই সেটিংস (SMS API Gateway Setup)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              বাংলাদেশের শীর্ষস্থানীয় এসএমএস গেটওয়ে বা আপনার কাস্টম REST API সংযুক্ত করুন
            </p>

            <form onSubmit={handleSaveSmsApi} className="space-y-4 text-xs">
              {/* Provider Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  এসএমএস গেটওয়ে প্রোভাইডার নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'greenweb', name: 'Greenweb' },
                    { id: 'bulksmsbd', name: 'BulkSMSBD' },
                    { id: 'onnorokom', name: 'Onnorokom' },
                    { id: 'teletalk', name: 'Teletalk' },
                    { id: 'custom', name: 'Custom API' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        let endpoint = smsApiForm.apiEndpoint;
                        if (p.id === 'greenweb') endpoint = 'https://api.greenweb.com.bd/api.php';
                        if (p.id === 'bulksmsbd') endpoint = 'http://bulksmsbd.net/api/smsapi';
                        if (p.id === 'onnorokom') endpoint = 'https://api2.onnorokomsms.com/send-sms';
                        if (p.id === 'teletalk') endpoint = 'https://bulkmessage.teletalk.com.bd/api/send';
                        setSmsApiForm({ ...smsApiForm, provider: p.id as any, apiEndpoint: endpoint });
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        smsApiForm.provider === p.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    এপিআই কী / টোকেন (API Key / Auth Token) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showApiKey ? 'লুকান' : 'দেখান'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    required
                    value={smsApiForm.apiKey}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, apiKey: e.target.value })}
                    placeholder="gw_live_xxxxxxxxxxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Sender ID & API Endpoint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">
                    সেন্ডার আইডি (Sender ID / Masking Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={smsApiForm.senderId}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, senderId: e.target.value })}
                    placeholder="যেমন: PRIMARYSCH"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    এসএমএস কোটা / ব্যালেন্স সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={smsApiForm.balance}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, balance: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  এপিআই এন্ডপয়েন্ট ইউআরএল (API Endpoint URL) *
                </label>
                <input
                  type="text"
                  required
                  value={smsApiForm.apiEndpoint}
                  onChange={(e) => setSmsApiForm({ ...smsApiForm, apiEndpoint: e.target.value })}
                  placeholder="https://api.greenweb.com.bd/api.php"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={smsApiForm.isActive}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>এসএমএস গেটওয়ে সার্ভিস সক্রিয় রাখুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={smsApiForm.isMasking}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, isMasking: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>মাস্কিং এসএমএস (স্কুলের নামে যাবে)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
              >
                এসএমএস এপিআই কনফিগারেশন সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS & SUPER ADMIN */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                সুপার অ্যাডমিন ও শ্রেণি শিক্ষকদের লগইন তালিকা
              </h3>
              <p className="text-xs text-slate-500">
                সুপার অ্যাডমিন হিসেবে শুধুমাত্র আপনি নতুন শিক্ষকদের পাসওয়ার্ড ও শ্রেণি বরাদ্দ দিতে পারবেন
              </p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন শিক্ষকের লগইন তৈরি করুন</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3">ব্যবহারকারীর নাম</th>
                  <th className="p-3">ইমেইল (লগইন আইডি)</th>
                  <th className="p-3">ভূমিকা (Role)</th>
                  <th className="p-3">বরাদ্দকৃত শ্রেণি</th>
                  <th className="p-3 text-center">২-ফ্যাক্টর অথেনটিকেশন (2FA)</th>
                  <th className="p-3 text-center">লগইন পিন</th>
                  <th className="p-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const assignedClassName = classes.find((c) => c.id === u.assignedClass)?.name;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                        {u.name}
                        {u.role === 'super_admin' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                            সুপার অ্যাডমিন
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {u.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'শ্রেণি শিক্ষক'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-600">
                        {u.role === 'super_admin' ? 'সকল শ্রেণি (Full Access)' : assignedClassName || '—'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => updateUser(u.id, { is2FAEnabled: !u.is2FAEnabled })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            u.is2FAEnabled
                              ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {u.is2FAEnabled ? '✓ 2FA চালু' : '✗ বন্ধ (ক্লিক করে চালু)'}
                        </button>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">
                        ••••••
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি "${u.name}" এর অ্যাকাউন্ট মুছে ফেলতে চান?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="text-rose-500 hover:underline font-bold text-[11px]"
                          >
                            মুছুন
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP, RESTORE & GOOGLE DRIVE SYNC */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Drive Status */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Google Drive ক্লাউড ডাটাবেস
                    </h4>
                    <p className="text-xs text-slate-500">স্বয়ংক্রিয় ক্লাউড ব্যাকআপ ও রিভিশন হিস্ট্রি</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  সংযুক্ত
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                <p>Google একাউন্ট: <strong className="font-mono text-blue-600">{syncState.googleDriveEmail}</strong></p>
                <p>সর্বশেষ সিঙ্ক: <strong>{syncState.lastSyncTime}</strong></p>
                <p>ব্যাকআপ সাইকেল: <strong>প্রতিদিন স্বয়ংক্রিয়</strong></p>
              </div>

              <button
                onClick={handleSyncDrive}
                disabled={isSyncingDrive}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                <span>{isSyncingDrive ? 'ক্লাউড সিঙ্ক চলছে...' : 'এখনই ড্রাইভে সিঙ্ক করুন'}</span>
              </button>
            </div>

            {/* Offline Local Folder Mode */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      অফলাইন লোকাল স্টোরেজ ও অটো-সিঙ্ক
                    </h4>
                    <p className="text-xs text-slate-500">ইন্টারনেট না থাকলেও নিরবচ্ছিন্ন কার্যক্রম</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    syncState.isOnline
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {syncState.isOnline ? 'অনলাইন' : 'অফলাইন ফোল্ডারে সেভ'}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                <p>বর্তমান স্ট্যাটাস: <strong>{syncState.isOnline ? 'সরাসরি অনলাইন মোডে সচল' : 'অফলাইনে লোকাল মেমরিতে সুরক্ষিত'}</strong></p>
                <p>পেন্ডিং সিঙ্ক: <strong>{toBanglaNumber(syncState.pendingSyncCount)} টি পরিবর্তন</strong></p>
                <p className="text-[11px] text-slate-400">নেটওয়ার্ক আসার সাথে সাথে ব্যাকগ্রাউন্ডে গুগল ড্রাইভে সিঙ্ক হবে।</p>
              </div>

              <button
                onClick={toggleOnlineSimulator}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>{syncState.isOnline ? 'অফলাইন মোড পরীক্ষা করুন' : 'অনলাইন মোডে ফিরে যান'}</span>
              </button>
            </div>
          </div>

          {/* Manual JSON Export / Import */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>এক ক্লিকে ডাটাবেস ডাউনলোড ও রিস্টোর (JSON Backup)</span>
            </h4>
            <p className="text-xs text-slate-500">
              বিদ্যালয়ের যাবতীয় শিক্ষার্থী, ফলাফল, হাজিরা, এবং ফি আদায়ের তথ্য এনক্রিপ্টেড ব্যাকআপ ফাইল হিসেবে সেভ করুন।
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportDatabaseBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" />
                <span>সম্পূর্ণ ডাটাবেস ডাউনলোড করুন (.json)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer border border-slate-300 dark:border-slate-700">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('আপনি কি টেস্ট ডাটাবেস সম্পূর্ণ রিসেট করে ডিফল্ট অবস্থায় নিতে চান?')) {
                    resetAllData();
                    setSuccessMsg('ডাটাবেস সফলভাবে ফ্যাক্টরি রিসেট করা হয়েছে!');
                  }
                }}
                className="ml-auto text-rose-500 hover:underline text-xs font-bold"
              >
                ফ্যাক্টরি রিসেট (নমুনা ডাটা)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Login Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              নতুন শিক্ষকের অ্যাকাউন্ট তৈরি
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">শিক্ষকের নাম *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="যেমন: ফারহানা ইয়াসমিন"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ইমেইল এড্রেস (লগইন ইউজারনেম) *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="teacher@school.edu.bd"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">শ্রেণি শিক্ষক পদবী</label>
                  <select
                    value={newUserForm.assignedClass}
                    onChange={(e) => setNewUserForm({ ...newUserForm, assignedClass: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">পাসওয়ার্ড / পিন</label>
                  <input
                    type="password"
                    value={newUserForm.pin}
                    onChange={(e) => setNewUserForm({ ...newUserForm, pin: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="user2FA"
                  checked={newUserForm.is2FAEnabled}
                  onChange={(e) => setNewUserForm({ ...newUserForm, is2FAEnabled: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4"
                />
                <label htmlFor="user2FA" className="font-bold text-slate-700 dark:text-slate-300">
                  টু-ফ্যাক্টর অথেনটিকেশন (2FA) বাধ্যতামূলক করুন
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
