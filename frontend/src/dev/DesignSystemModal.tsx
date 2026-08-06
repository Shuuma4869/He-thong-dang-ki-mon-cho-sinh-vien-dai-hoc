import React, { useState } from 'react';
import {
  X,
  Palette,
  Type,
  LayoutGrid,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  Info,
} from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'spacing' | 'components'>('colors');

  if (!isOpen) return null;

  const colorSwatches = [
    { name: 'Primary', hex: '#2563EB', role: 'Main Brand Blue', text: 'text-white', bg: 'bg-[#2563EB]' },
    { name: 'Primary Hover', hex: '#1D4ED8', role: 'Active/Hover State', text: 'text-white', bg: 'bg-[#1D4ED8]' },
    { name: 'Success', hex: '#22C55E', role: 'Approved / Enrolled', text: 'text-white', bg: 'bg-[#22C55E]' },
    { name: 'Warning', hex: '#F59E0B', role: 'Pending / Conflict', text: 'text-white', bg: 'bg-[#F59E0B]' },
    { name: 'Danger', hex: '#EF4444', role: 'Full / Error / Cancel', text: 'text-white', bg: 'bg-[#EF4444]' },
    { name: 'Background', hex: '#F8FAFC', role: 'Page Background', text: 'text-slate-900', bg: 'bg-[#F8FAFC]', border: true },
    { name: 'Surface', hex: '#FFFFFF', role: 'Card & Modal Canvas', text: 'text-slate-900', bg: 'bg-[#FFFFFF]', border: true },
    { name: 'Border', hex: '#E2E8F0', role: 'Dividers & Outlines', text: 'text-slate-900', bg: 'bg-[#E2E8F0]', border: true },
    { name: 'Title', hex: '#0F172A', role: 'Headings & Titles', text: 'text-white', bg: 'bg-[#0F172A]' },
    { name: 'Body', hex: '#475569', role: 'Standard Body Copy', text: 'text-white', bg: 'bg-[#475569]' },
    { name: 'Secondary Text', hex: '#64748B', role: 'Captions & Subtitles', text: 'text-white', bg: 'bg-[#64748B]' },
  ];

  const typographyList = [
    { level: 'Large Title', size: '32px / 2rem', weight: '700 Bold', sample: 'Hệ thống Đăng ký Môn học', class: 'text-2xl font-bold' },
    { level: 'Heading', size: '24px / 1.5rem', weight: '700 Bold', sample: 'Xin chào, Nguyễn Văn A', class: 'text-xl font-bold' },
    { level: 'Section Title', size: '20px / 1.25rem', weight: '600 SemiBold', sample: 'Danh Sách Học Phần Mở Đăng Ký', class: 'text-lg font-semibold' },
    { level: 'Card Title', size: '18px / 1.125rem', weight: '600 SemiBold', sample: 'Lập trình Web nâng cao', class: 'text-base font-semibold' },
    { level: 'Body', size: '16px / 1rem', weight: '400 Regular', sample: 'Nền tảng hỗ trợ sinh viên đăng ký học phần nhanh chóng.', class: 'text-sm font-normal' },
    { level: 'Small', size: '14px / 0.875rem', weight: '400 Regular', sample: 'Mã SV: 21010045 • Lớp CNTT-K16', class: 'text-xs font-normal' },
    { level: 'Caption', size: '12px / 0.75rem', weight: '400 Regular', sample: '© Đại học Phenikaa. Tất cả quyền được bảo lưu.', class: 'text-[11px] font-normal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Hệ Thống Thiết Kế Figma (Design System Specs)</h2>
              <p className="text-xs text-slate-300">Đại học Phenikaa • Enterprise Material 3 Design System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSection('colors')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'colors' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Bảng Màu (Color Tokens)</span>
          </button>

          <button
            onClick={() => setActiveSection('typography')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'typography' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Kiểu Chữ (Typography)</span>
          </button>

          <button
            onClick={() => setActiveSection('spacing')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'spacing' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Spacings & Layout</span>
          </button>

          <button
            onClick={() => setActiveSection('components')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'components' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Thành Phần (UI Components)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* COLORS SECTION */}
          {activeSection === 'colors' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Màu sắc chuẩn được định nghĩa theo quy chuẩn Thương hiệu Đại học Phenikaa và đảm bảo độ tương phản tiếp cận WCAG AA.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {colorSwatches.map((swatch) => (
                  <div key={swatch.name} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div
                      className={`h-16 rounded-lg ${swatch.bg} flex items-end p-2.5 shadow-inner ${
                        swatch.border ? 'border border-slate-300' : ''
                      }`}
                    >
                      <span className={`font-mono text-[10px] font-bold ${swatch.text}`}>{swatch.hex}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{swatch.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{swatch.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPOGRAPHY SECTION */}
          {activeSection === 'typography' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Sử dụng phông chữ tiêu chuẩn Inter với quy cách phân cấp chuẩn Figma UI Kit.
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {typographyList.map((item) => (
                  <div key={item.level} className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="w-48 shrink-0">
                      <span className="font-bold text-slate-900 block">{item.level}</span>
                      <span className="text-[10px] font-mono text-slate-500">{item.size} • {item.weight}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`${item.class} text-slate-800`}>{item.sample}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPACING SECTION */}
          {activeSection === 'spacing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-blue-900">
                <h4 className="font-bold text-sm">Hệ Thống Khoảng Cách 8-Point Grid (8px Spacing System)</h4>
                <p className="text-xs leading-relaxed">
                  Tất cả các khoảng cách padding, margin, width, height và gap đều tuân thủ các bội số của 8px (8px, 16px, 24px, 32px, 48px, 64px) để đảm bảo tính nhịp nhàng và nhất quán trên giao diện desktop.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <span className="font-bold text-slate-900 block">8px (gap-2 / p-2)</span>
                  <p className="text-[10px] text-slate-500">Khoảng cách giữa icon và label</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <span className="font-bold text-slate-900 block">16px (gap-4 / p-4)</span>
                  <p className="text-[10px] text-slate-500">Inner padding tiêu chuẩn của card</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <span className="font-bold text-slate-900 block">24px (p-6)</span>
                  <p className="text-[10px] text-slate-500">Outer padding của container chính</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <span className="font-bold text-slate-900 block">12 - 16px Radius</span>
                  <p className="text-[10px] text-slate-500">Bo góc mềm mại chuẩn Enterprise</p>
                </div>
              </div>
            </div>
          )}

          {/* COMPONENTS SHOWCASE */}
          {activeSection === 'components' && (
            <div className="space-y-6">
              {/* Buttons */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">Buttons & Actions</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs">Primary Action</button>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-xl">Secondary Action</button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-xl">Outline Action</button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed">Disabled State</button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">Status Chips & Badges</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Còn chỗ</span>
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 font-bold rounded-full inline-flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Đã đầy</span>
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-full inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Trùng lịch</span>
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đã đăng ký</span>
                  </span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">Text Inputs & Selects</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      readOnly
                      value="Tìm kiếm môn học..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                    />
                  </div>

                  <div className="relative">
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 appearance-none">
                      <option>Học kỳ 1 - Năm học 2026-2027</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 font-mono text-[11px]">Auto Layout Enabled • Figma Token Spec v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
