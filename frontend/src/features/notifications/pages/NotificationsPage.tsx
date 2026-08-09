import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Calendar, CheckCircle2 } from 'lucide-react';
import { UniversityNotification } from '@/features/notifications/types/notification.types';

interface NotificationsPageProps {
  notifications: UniversityNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const ALL_CATEGORY = 'Tat ca';

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [activeNotifId, setActiveNotifId] = useState<string | null>(notifications[0]?.id ?? null);

  useEffect(() => {
    if (!activeNotifId && notifications.length > 0) {
      setActiveNotifId(notifications[0].id);
      return;
    }

    if (activeNotifId && !notifications.some((notification) => notification.id === activeNotifId)) {
      setActiveNotifId(notifications[0]?.id ?? null);
    }
  }, [activeNotifId, notifications]);

  const categories = useMemo(() => {
    return [ALL_CATEGORY, ...Array.from(new Set(notifications.map((notification) => notification.category)))];
  }, [notifications]);

  const filteredNotifs = notifications.filter((notification) => {
    return selectedCategory === ALL_CATEGORY || notification.category === selectedCategory;
  });

  const activeNotif = notifications.find((notification) => notification.id === activeNotifId) ?? null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Thong bao demo/local</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tinh nang giao dien bo tro, dung du lieu mau va trang thai doc/chua doc trong frontend.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Danh dau tat ca la da doc</span>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        Notifications chua co backend persistence trong phien ban do an hien tai. Cac thong bao ben duoi la demo/local state,
        khong dong bo tu backend.
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Khong co thong bao nao trong muc nay</div>
          ) : (
            filteredNotifs.map((notification) => {
              const isSelected = activeNotifId === notification.id;

              return (
                <button
                  key={notification.id}
                  onClick={() => {
                    onMarkRead(notification.id);
                    setActiveNotifId(notification.id);
                  }}
                  className={`block w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2 ${
                    isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : ''
                  } ${!notification.isRead ? 'font-medium' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">
                      {notification.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{notification.createdAt}</span>
                  </div>

                  <h3 className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'} line-clamp-2`}>
                    {!notification.isRead && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2" />}
                    {notification.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {notification.summary}
                  </p>
                </button>
              );
            })
          )}
        </div>

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
                  Noi dung nay duoc giu o pham vi demo giao dien, chua dong bo tu backend.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Chon mot thong bao trong danh sach de xem noi dung chi tiet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
