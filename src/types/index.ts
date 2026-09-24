export type Role = 'admin' | 'ustadz' | 'wali';

export interface AuthUser {
  id: string;
  role: Role;
  name: string;
  identifier: string; // username, NIP, or NIS
  santriId?: string; // Strictly set for Wali Santri so they can only see their child
  ustadzId?: string; // Strictly set for Ustadz
  avatarUrl?: string;
  phone?: string;
  title?: string;
}

export type ActivityType = 'sekolah' | 'ngaji_kitab' | 'ngaji_quran' | 'jamaah_sholat' | 'diniyah';

export interface ActivityConfig {
  id: ActivityType;
  name: string;
  arabicName: string;
  description: string;
  timeSlot: string;
  iconName: string;
  color: string;
  isActive: boolean;
  requiredFields?: ('juzSurah' | 'kitabTitle' | 'sholatTime' | 'score')[];
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'masbuq';

export interface Santri {
  id: string;
  nis: string; // Nomor Induk Santri, e.g., '2024.01.001'
  nama: string;
  gender: 'L' | 'P';
  kelasFormal: string; // e.g., 'X MA Terpadu', 'VIII MTs'
  kelasDiniyah: string; // e.g., 'Wustha 2', 'Ulya 1'
  kamar: string; // e.g., 'Komplek Al-Farabi No. 04'
  waliNama: string;
  waliPhone: string;
  waliEmail?: string;
  waliPin?: string; // PIN for wali login
  fotoUrl: string;
  statusSantri: 'aktif' | 'izin_pulang' | 'alumni';
  hafalanTerakhir?: string;
  kitabTerakhir?: string;
  catatanKesehatan?: string;
}

export interface AttendanceRecord {
  id: string;
  santriId: string;
  santriNis: string;
  santriNama: string;
  kamar: string;
  activityId: ActivityType;
  activityName: string;
  subActivity?: string; // e.g., "Sholat Subuh", "Nahwu - Al-Jurumiyah", "Juz 29 - Al-Mulk"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  status: AttendanceStatus;
  ustadzId: string;
  ustadzNama: string;
  notes?: string;
  verifiedMethod: 'qr_scan' | 'manual';
  location?: string;
}

export interface Ustadz {
  id: string;
  nama: string;
  nip: string;
  specialty: string; // e.g., 'Pengampu Tahfidz', 'Guru Diniyah Nahwu', 'Wali Kamar'
  phone: string;
  fotoUrl: string;
}

export interface PesantrenInfo {
  namaPondok: string;
  yayasan: string;
  pengasuh: string;
  alamat: string;
  telepon: string;
  website: string;
  email: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  themeColor: 'emerald' | 'navy' | 'maroon';
}
