import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  AuthUser,
  ActivityConfig,
  Santri,
  Ustadz,
  AttendanceRecord,
  PesantrenInfo,
  ActivityType,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_PESANTREN_INFO,
  INITIAL_SANTRI,
  INITIAL_USTADZ,
  INITIAL_ATTENDANCE,
  getTodayDateString,
} from '../data/mockData';

interface PesantrenContextType {
  currentUser: AuthUser | null;
  login: (role: Role, identifier: string, passwordOrPin: string) => { success: boolean; message?: string };
  loginAsSantriWali: (santriId: string) => void;
  loginAsUstadz: (ustadzId: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  role: Role;
  setRole: (role: Role) => void;
  activeUstadzId: string;
  setActiveUstadzId: (id: string) => void;
  selectedSantriIdForWali: string;
  setSelectedSantriIdForWali: (id: string) => void;
  pesantrenInfo: PesantrenInfo;
  updatePesantrenInfo: (info: Partial<PesantrenInfo>) => void;
  activities: ActivityConfig[];
  toggleActivity: (id: ActivityType) => void;
  updateActivity: (id: ActivityType, updates: Partial<ActivityConfig>) => void;
  santriList: Santri[];
  addSantri: (santri: Omit<Santri, 'id'>) => void;
  updateSantri: (id: string, updates: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  ustadzList: Ustadz[];
  attendanceRecords: AttendanceRecord[];
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => AttendanceRecord;
  batchRecordAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  getSantriById: (id: string) => Santri | undefined;
  getSantriByNis: (nis: string) => Santri | undefined;
  getAttendanceForSantri: (santriId: string, date?: string) => AttendanceRecord[];
  activeActivities: ActivityConfig[];
  currentUstadz: Ustadz | undefined;
  selectedSantriForWali: Santri | undefined;
  resetAllData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PesantrenContext = createContext<PesantrenContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_USER: 'santri_connect_auth_user_v2',
  PESANTREN_INFO: 'santri_connect_info_v1',
  ACTIVITIES: 'santri_connect_activities_v1',
  SANTRI: 'santri_connect_santri_v1',
  USTADZ: 'santri_connect_ustadz_v1',
  ATTENDANCE: 'santri_connect_attendance_v1',
  ROLE: 'santri_connect_active_role_v1',
  ACTIVE_USTADZ: 'santri_connect_active_ustadz_v1',
  WALI_SANTRI: 'santri_connect_wali_santri_v1',
};

export const PesantrenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRoleState] = useState<Role>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.role || 'admin';
      } catch (e) {}
    }
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as Role) || 'admin';
  });

  const [activeUstadzId, setActiveUstadzIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USTADZ);
    return saved || 'u-001';
  });

  const [selectedSantriIdForWali, setSelectedSantriIdForWaliState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALI_SANTRI);
    return saved || 's-001';
  });

  const [pesantrenInfo, setPesantrenInfo] = useState<PesantrenInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PESANTREN_INFO);
    return saved ? JSON.parse(saved) : INITIAL_PESANTREN_INFO;
  });

  const [activities, setActivities] = useState<ActivityConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [santriList, setSantriList] = useState<Santri[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SANTRI);
    return saved ? JSON.parse(saved) : INITIAL_SANTRI;
  });

  const [ustadzList] = useState<Ustadz[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USTADZ);
    return saved ? JSON.parse(saved) : INITIAL_USTADZ;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const login = (
    loginRole: Role,
    identifier: string,
    passwordOrPin: string
  ): { success: boolean; message?: string } => {
    const cleanId = identifier.trim();

    if (!cleanId) {
      return { success: false, message: 'Mohon masukkan identitas login (NIS / NIP / Username).' };
    }

    if (loginRole === 'wali') {
      // Find matching santri by NIS or Wali Phone
      const foundSantri = santriList.find((s) => {
        const matchesNis = s.nis.trim().toLowerCase() === cleanId.toLowerCase();
        const matchesPhone = s.waliPhone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
        const matchesName = s.nama.toLowerCase().includes(cleanId.toLowerCase());
        return matchesNis || matchesPhone || matchesName;
      });

      if (!foundSantri) {
        return {
          success: false,
          message: 'Data santri tidak ditemukan. Pastikan NIS atau No. WhatsApp sudah sesuai.',
        };
      }

      // Check PIN (default 1234 if not configured or matches)
      const expectedPin = foundSantri.waliPin || '1234';
      if (passwordOrPin && passwordOrPin !== expectedPin && passwordOrPin !== '1234') {
        return {
          success: false,
          message: 'PIN Wali Santri tidak tepat. Gunakan PIN default 1234.',
        };
      }

      const auth: AuthUser = {
        id: `auth-wali-${foundSantri.id}`,
        role: 'wali',
        name: foundSantri.waliNama,
        identifier: foundSantri.nis,
        santriId: foundSantri.id,
        phone: foundSantri.waliPhone,
        title: `Wali Santri dari ${foundSantri.nama}`,
        avatarUrl: foundSantri.fotoUrl,
      };

      setCurrentUser(auth);
      setRoleState('wali');
      setSelectedSantriIdForWaliState(foundSantri.id);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
      localStorage.setItem(STORAGE_KEYS.ROLE, 'wali');
      localStorage.setItem(STORAGE_KEYS.WALI_SANTRI, foundSantri.id);

      showToast(`Ahlan wa Sahlan, ${foundSantri.waliNama}`);
      return { success: true };
    }

    if (loginRole === 'ustadz') {
      const foundUstadz = ustadzList.find((u) => {
        const matchesNip = u.nip.trim().toLowerCase() === cleanId.toLowerCase();
        const matchesPhone = u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
        const matchesNama = u.nama.toLowerCase().includes(cleanId.toLowerCase());
        return matchesNip || matchesPhone || matchesNama;
      }) || (cleanId.toLowerCase() === 'ustadz' ? ustadzList[0] : undefined);

      if (!foundUstadz) {
        return {
          success: false,
          message: 'Akun Ustadz / NIP tidak terdaftar di pesantren.',
        };
      }

      // Default password ustadz123 / ustadz
      const validPass = ['ustadz', 'ustadz123', '123456', '1234'];
      if (passwordOrPin && !validPass.includes(passwordOrPin.toLowerCase())) {
        return {
          success: false,
          message: 'Kata sandi Ustadz salah. Gunakan ustadz123.',
        };
      }

      const auth: AuthUser = {
        id: `auth-ustadz-${foundUstadz.id}`,
        role: 'ustadz',
        name: foundUstadz.nama,
        identifier: foundUstadz.nip,
        ustadzId: foundUstadz.id,
        phone: foundUstadz.phone,
        title: foundUstadz.specialty,
        avatarUrl: foundUstadz.fotoUrl,
      };

      setCurrentUser(auth);
      setRoleState('ustadz');
      setActiveUstadzIdState(foundUstadz.id);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
      localStorage.setItem(STORAGE_KEYS.ROLE, 'ustadz');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USTADZ, foundUstadz.id);

      showToast(`Selamat bertugas, ${foundUstadz.nama}`);
      return { success: true };
    }

    if (loginRole === 'admin') {
      const validAdmins = ['admin', 'pengasuh', 'ronas', 'kholis'];
      const isUserMatch = validAdmins.some((v) => cleanId.toLowerCase().includes(v));

      const validPass = ['admin', 'admin123', '123456', 'ronas123'];
      const isPassMatch = validPass.includes(passwordOrPin.toLowerCase());

      if (!isUserMatch || !isPassMatch) {
        return {
          success: false,
          message: 'Username atau kata sandi Pengasuh/Admin salah. (Gunakan admin / admin123).',
        };
      }

      const auth: AuthUser = {
        id: 'auth-admin',
        role: 'admin',
        name: pesantrenInfo.pengasuh || 'Drs. Nur Kholis, M. Pd.I',
        identifier: 'admin',
        title: 'Pengasuh & Administrator Pondok',
      };

      setCurrentUser(auth);
      setRoleState('admin');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
      localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');

      showToast(`Selamat datang Pengasuh, ${auth.name}`);
      return { success: true };
    }

    return { success: false, message: 'Role login tidak valid.' };
  };

  const loginAsSantriWali = (santriId: string) => {
    const santri = santriList.find((s) => s.id === santriId) || santriList[0];
    const auth: AuthUser = {
      id: `auth-wali-${santri.id}`,
      role: 'wali',
      name: santri.waliNama,
      identifier: santri.nis,
      santriId: santri.id,
      phone: santri.waliPhone,
      title: `Wali Santri dari ${santri.nama}`,
      avatarUrl: santri.fotoUrl,
    };
    setCurrentUser(auth);
    setRoleState('wali');
    setSelectedSantriIdForWaliState(santri.id);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'wali');
    localStorage.setItem(STORAGE_KEYS.WALI_SANTRI, santri.id);
    showToast(`Masuk sebagai ${santri.waliNama} (Wali dari ${santri.nama})`);
  };

  const loginAsUstadz = (ustadzId: string) => {
    const ustadz = ustadzList.find((u) => u.id === ustadzId) || ustadzList[0];
    const auth: AuthUser = {
      id: `auth-ustadz-${ustadz.id}`,
      role: 'ustadz',
      name: ustadz.nama,
      identifier: ustadz.nip,
      ustadzId: ustadz.id,
      phone: ustadz.phone,
      title: ustadz.specialty,
      avatarUrl: ustadz.fotoUrl,
    };
    setCurrentUser(auth);
    setRoleState('ustadz');
    setActiveUstadzIdState(ustadz.id);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'ustadz');
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USTADZ, ustadz.id);
    showToast(`Masuk sebagai ${ustadz.nama}`);
  };

  const loginAsAdmin = () => {
    const auth: AuthUser = {
      id: 'auth-admin',
      role: 'admin',
      name: pesantrenInfo.pengasuh || 'Drs. Nur Kholis, M. Pd.I',
      identifier: 'admin',
      title: 'Pengasuh & Administrator Pondok',
    };
    setCurrentUser(auth);
    setRoleState('admin');
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(auth));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
    showToast(`Masuk sebagai Pengasuh / Admin Pondok`);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    showToast('Anda telah keluar dari sistem.');
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
  };

  const setActiveUstadzId = (id: string) => {
    setActiveUstadzIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USTADZ, id);
  };

  const setSelectedSantriIdForWali = (id: string) => {
    setSelectedSantriIdForWaliState(id);
    localStorage.setItem(STORAGE_KEYS.WALI_SANTRI, id);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PESANTREN_INFO, JSON.stringify(pesantrenInfo));
  }, [pesantrenInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(santriList));
  }, [santriList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const updatePesantrenInfo = (info: Partial<PesantrenInfo>) => {
    setPesantrenInfo((prev) => ({ ...prev, ...info }));
    showToast('Profil Pesantren berhasil diperbarui');
  };

  const toggleActivity = (id: ActivityType) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const nextState = !act.isActive;
          showToast(
            `Kegiatan ${act.name} ${nextState ? 'diaktifkan' : 'dinonaktifkan'}`
          );
          return { ...act, isActive: nextState };
        }
        return act;
      })
    );
  };

  const updateActivity = (id: ActivityType, updates: Partial<ActivityConfig>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );
    showToast('Pengaturan kegiatan diperbarui');
  };

  const addSantri = (newSantriData: Omit<Santri, 'id'>) => {
    const newId = `s-${String(santriList.length + 1).padStart(3, '0')}`;
    const newSantri: Santri = {
      ...newSantriData,
      id: newId,
    };
    setSantriList((prev) => [newSantri, ...prev]);
    showToast(`Santri ${newSantri.nama} berhasil ditambahkan`);
  };

  const updateSantri = (id: string, updates: Partial<Santri>) => {
    setSantriList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Data santri berhasil diubah');
  };

  const deleteSantri = (id: string) => {
    const s = santriList.find((x) => x.id === id);
    setSantriList((prev) => prev.filter((item) => item.id !== id));
    showToast(`Santri ${s?.nama || ''} telah dihapus`);
  };

  const recordAttendance = (recordData: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setAttendanceRecords((prev) => {
      // If there's an existing record for the same santri, activity, and subActivity on the same date, update it
      const filtered = prev.filter(
        (r) =>
          !(
            r.santriId === newRecord.santriId &&
            r.activityId === newRecord.activityId &&
            r.date === newRecord.date &&
            r.subActivity === newRecord.subActivity
          )
      );
      return [newRecord, ...filtered];
    });

    return newRecord;
  };

  const batchRecordAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const timestamp = Date.now();
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${timestamp}-${idx}`,
    }));

    setAttendanceRecords((prev) => [...newRecords, ...prev]);
    showToast(`Presensi ${records.length} santri berhasil dicatat`);
  };

  const getSantriById = (id: string) => santriList.find((s) => s.id === id);
  const getSantriByNis = (nis: string) =>
    santriList.find((s) => s.nis.trim().toLowerCase() === nis.trim().toLowerCase());

  const getAttendanceForSantri = (santriId: string, date?: string) => {
    return attendanceRecords.filter((r) => {
      if (r.santriId !== santriId) return false;
      if (date && r.date !== date) return false;
      return true;
    });
  };

  const resetAllData = () => {
    setPesantrenInfo(INITIAL_PESANTREN_INFO);
    setActivities(INITIAL_ACTIVITIES);
    setSantriList(INITIAL_SANTRI);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    localStorage.clear();
    showToast('Data sistem telah dikembalikan ke awal');
  };

  const activeActivities = activities.filter((a) => a.isActive);
  const currentUstadz = ustadzList.find((u) => u.id === activeUstadzId) || ustadzList[0];
  
  // For Wali role, strictly lock to authenticated child only!
  const selectedSantriForWali =
    currentUser?.role === 'wali' && currentUser.santriId
      ? (santriList.find((s) => s.id === currentUser.santriId) || santriList[0])
      : (santriList.find((s) => s.id === selectedSantriIdForWali) || santriList[0]);

  return (
    <PesantrenContext.Provider
      value={{
        currentUser,
        login,
        loginAsSantriWali,
        loginAsUstadz,
        loginAsAdmin,
        logout,
        role,
        setRole,
        activeUstadzId,
        setActiveUstadzId,
        selectedSantriIdForWali,
        setSelectedSantriIdForWali,
        pesantrenInfo,
        updatePesantrenInfo,
        activities,
        toggleActivity,
        updateActivity,
        santriList,
        addSantri,
        updateSantri,
        deleteSantri,
        ustadzList,
        attendanceRecords,
        recordAttendance,
        batchRecordAttendance,
        getSantriById,
        getSantriByNis,
        getAttendanceForSantri,
        activeActivities,
        currentUstadz,
        selectedSantriForWali,
        resetAllData,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md border border-emerald-500/40 text-sm font-medium flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </PesantrenContext.Provider>
  );
};

export const usePesantren = () => {
  const context = useContext(PesantrenContext);
  if (!context) {
    throw new Error('usePesantren must be used within a PesantrenProvider');
  }
  return context;
};
