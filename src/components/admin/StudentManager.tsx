import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { Santri } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Phone,
  Home,
  GraduationCap,
  Sparkles,
  X,
  Save,
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const { santriList, addSantri, updateSantri, deleteSantri } = usePesantren();

  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'L' | 'P'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  const [formData, setFormData] = useState<Omit<Santri, 'id'>>({
    nis: '',
    nama: '',
    gender: 'L',
    kelasFormal: 'X MA Terpadu',
    kelasDiniyah: 'Ulya 1',
    kamar: 'Asrama Al-Farabi 01',
    waliNama: '',
    waliPhone: '',
    waliEmail: '',
    waliPin: '1234',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
    statusSantri: 'aktif',
    hafalanTerakhir: 'Juz 30',
    kitabTerakhir: 'Fathul Qorib',
  });

  const handleOpenAdd = () => {
    setEditingSantri(null);
    const nextNisNum = String(santriList.length + 1).padStart(3, '0');
    setFormData({
      nis: `2024.01.${nextNisNum}`,
      nama: '',
      gender: 'L',
      kelasFormal: 'X MA Terpadu',
      kelasDiniyah: 'Ulya 1',
      kamar: 'Asrama Al-Farabi 01',
      waliNama: '',
      waliPhone: '',
      waliEmail: '',
      waliPin: '1234',
      fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
      statusSantri: 'aktif',
      hafalanTerakhir: 'Juz 30',
      kitabTerakhir: 'Fathul Qorib',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditingSantri(s);
    setFormData({
      nis: s.nis,
      nama: s.nama,
      gender: s.gender,
      kelasFormal: s.kelasFormal,
      kelasDiniyah: s.kelasDiniyah,
      kamar: s.kamar,
      waliNama: s.waliNama,
      waliPhone: s.waliPhone,
      waliEmail: s.waliEmail || '',
      waliPin: s.waliPin || '1234',
      fotoUrl: s.fotoUrl,
      statusSantri: s.statusSantri,
      hafalanTerakhir: s.hafalanTerakhir || '',
      kitabTerakhir: s.kitabTerakhir || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.nis.trim()) return;

    if (editingSantri) {
      updateSantri(editingSantri.id, formData);
    } else {
      addSantri(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = santriList.filter((s) => {
    const matchGender = filterGender === 'all' || s.gender === filterGender;
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase()) ||
      s.kamar.toLowerCase().includes(search.toLowerCase());
    return matchGender && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari santri, NIS, atau kamar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value as any)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Santri</option>
            <option value="L">Putra (Santriwan)</option>
            <option value="P">Putri (Santriwati)</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Santri Baru</span>
        </button>
      </div>

      {/* Santri Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((santri) => (
          <div
            key={santri.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3">
                <div className="w-14 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                  <img
                    src={santri.fotoUrl}
                    alt={santri.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {santri.nis}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        santri.gender === 'L'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {santri.gender === 'L' ? 'Putra' : 'Putri'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate mt-0.5">{santri.nama}</h4>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-1">
                    <Home className="w-3 h-3 text-slate-500 shrink-0" />
                    {santri.kamar}
                  </p>
                </div>
              </div>

              {/* Education details */}
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas Formal:</span>
                  <span className="font-medium text-slate-200">{santri.kelasFormal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Madrasah Diniyah:</span>
                  <span className="font-medium text-slate-200">{santri.kelasDiniyah}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wali Santri:</span>
                  <span className="font-medium text-emerald-400 truncate max-w-[170px]">
                    {santri.waliNama}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <a
                href={`https://wa.me/62${santri.waliPhone.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>WA: {santri.waliPhone}</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(santri)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Edit Data"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus data santri ${santri.nama}?`)) {
                      deleteSantri(santri.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition"
                  title="Hapus Santri"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{editingSantri ? 'Edit Data Santri' : 'Tambah Santri Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nomor Induk Santri (NIS)</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="L">Putra (Santriwan)</option>
                    <option value="P">Putri (Santriwati)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Al-Fatih"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kelas Formal (Sekolah)</label>
                  <input
                    type="text"
                    placeholder="Contoh: X MA Terpadu 1"
                    value={formData.kelasFormal}
                    onChange={(e) => setFormData({ ...formData, kelasFormal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kelas Madrasah Diniyah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ulya 1 (Fiqih)"
                    value={formData.kelasDiniyah}
                    onChange={(e) => setFormData({ ...formData, kelasDiniyah: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Kamar / Komplek Asrama</label>
                <input
                  type="text"
                  placeholder="Contoh: Asrama Al-Farabi 02"
                  value={formData.kamar}
                  onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Wali Santri</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: H. Hendro Purnomo"
                    value={formData.waliNama}
                    onChange={(e) => setFormData({ ...formData, waliNama: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nomor WhatsApp Wali</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={formData.waliPhone}
                    onChange={(e) => setFormData({ ...formData, waliPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Foto Profil Santri (URL)</label>
                <input
                  type="url"
                  value={formData.fotoUrl}
                  onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
