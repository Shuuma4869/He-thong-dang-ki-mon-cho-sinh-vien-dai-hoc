import React from 'react';
import {
  LayoutDashboard,
  BookPlus,
  CheckSquare,
  CalendarDays,
  Bell,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '@/shared/types/navigation.types';
import { PhenikaaLogo } from '@/shared/components/branding/PhenikaaLogo';

interface SidebarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onLogout: () => void;
  registeredCount: number;
  unreadNotifCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  onLogout,
  registeredCount,
  unreadNotifCount,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Trang chủ',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'courses' as NavigationTab,
      label: 'Đăng ký môn học',
      icon: BookPlus,
      badge: 'HOT',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'registered' as NavigationTab,
      label: 'Môn đã đăng ký',
      icon: CheckSquare,
      badge: registeredCount > 0 ? `${registeredCount}` : null,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'timetable' as NavigationTab,
      label: 'Thời khóa biểu',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'notifications' as NavigationTab,
      label: 'Thông báo',
      icon: Bell,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : null,
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Hồ sơ sinh viên',
      icon: UserCircle,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-xs ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        {!collapsed ? (
          <PhenikaaLogo size="md" variant="full" />
        ) : (
          <PhenikaaLogo size="md" variant="icon" />
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${collapsed ? 'hidden' : 'block'}`}>
          Menu Chính
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {item.badge && !collapsed && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicator dot when collapsed */}
              {collapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-100 shrink-0 space-y-2">
        {!collapsed && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Phenikaa Portal v1.0</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Hệ thống đăng ký môn học trực tuyến bảo mật.
            </p>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs lg:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-5 h-5 shrink-0 text-red-500" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
