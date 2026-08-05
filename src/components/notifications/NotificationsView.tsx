import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Filter, Tag, Calendar, MailOpen } from 'lucide-react';
import { UniversityNotification } from '../../types';

interface NotificationsViewProps {
  notifications: UniversityNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeNotif, setActiveNotif] = useState<UniversityNotification | null>(
    notifications[0] || null
  );

  const categories = ['Tất cả', 'Đào tạo', 'Lịch học', 'Học phí', 'Hệ thống'];

  const filteredNotifs = notifications.filter((n) => {
    if (selectedCategory !== 'Tất cả' && n.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Thông Báo Từ Đại Học Phenikaa</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cập nhật tin tức đào tạo, lịch học, học phí và các thông báo chính thức từ Nhà trường.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Đánh dấu tất cả là đã đọc</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View Layout: Left List 40%, Right Detailed Article 60% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Không có thông báo nào trong mục này</div>
          ) : (
            filteredNotifs.map((notif) => {
              const isSelected = activeNotif?.id === notif.id;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkRead(notif.id);
                    setActiveNotif(notif);
                  }}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2 ${
                    isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : ''
                  } ${!notif.isRead ? 'font-medium' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                  </div>

                  <h3 className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'} line-clamp-2`}>
                    {!notif.isRead && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2" />}
                    {notif.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {notif.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Article Detail */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs min-h-[400px]">
          {activeNotif ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-lg">
                  {activeNotif.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeNotif.createdAt}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activeNotif.title}
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
                {activeNotif.summary}
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2 pt-2">
                <p>{activeNotif.content}</p>
                <p className="pt-4 text-slate-500 italic">
                  Trân trọng,<br />
                  <strong>Phòng Đào tạo - Đại học Phenikaa</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Chọn một thông báo ở danh sách bên trái để xem nội dung chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
