import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  FolderKanban,
  FileText,
  Settings,
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  MessageCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle,
  Calendar,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';
import { AppRoute, AdminNotification } from '../../types';

interface AdminLayoutProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: React.ReactNode;
  pendingLocalWorksCount?: number;
  pendingInvoicesCount?: number;
  onLogout?: () => void;
  notifications?: AdminNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onOpenSettings?: () => void;
  onCreateInvoice?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
  pendingLocalWorksCount = 0,
  pendingInvoicesCount = 0,
  onLogout,
  notifications: propNotifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenSettings,
  onCreateInvoice,
  searchTerm = '',
  onSearchChange,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Default rich notification items if none provided
  const [localNotifications, setLocalNotifications] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'Urgent: Flex Hoarding Deadline',
      description: 'Grand Opening Flex for Apex Developers is due in 3 hours.',
      timestamp: '15 mins ago',
      read: false,
      type: 'urgent',
      targetRoute: 'admin-local-works',
    },
    {
      id: 'notif-2',
      title: 'Payment Received: Darul Hasaniyyah',
      description: 'Advance payment of ₹15,000 received for Ramadan Campaign.',
      timestamp: '1 hour ago',
      read: false,
      type: 'payment',
      targetRoute: 'admin-invoices',
    },
    {
      id: 'notif-3',
      title: 'Revision Requested on Motion Reel',
      description: 'Client submitted 2 revisions on Instagram 3D Launch Teaser.',
      timestamp: '3 hours ago',
      read: false,
      type: 'project',
      targetRoute: 'admin-projects',
    },
    {
      id: 'notif-4',
      title: 'Production Queue Review',
      description: '4 graphic works scheduled for print proofing today.',
      timestamp: 'Today, 9:30 AM',
      read: true,
      type: 'info',
      targetRoute: 'admin-local-works',
    },
  ]);

  const activeNotifications = propNotifications || localNotifications;
  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  // Click outside to close notification center popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const handleMarkAsRead = (id: string) => {
    if (onMarkNotificationAsRead) {
      onMarkNotificationAsRead(id);
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllNotificationsAsRead) {
      onMarkAllNotificationsAsRead();
    } else {
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.targetRoute) {
      onNavigate(notif.targetRoute);
      setNotificationsOpen(false);
      setMobileDrawerOpen(false);
    }
  };

  // Human-readable Dynamic Breadcrumbs
  const getBreadcrumbTitle = () => {
    switch (currentRoute) {
      case 'admin-dashboard':
      case 'admin':
        return 'OVERVIEW DASHBOARD';
      case 'admin-projects':
        return 'PROJECTS PIPELINE';
      case 'admin-clients':
        return 'PEOPLE & CLIENTS';
      case 'admin-local-works':
        return 'LOCAL WORKS TRACKER';
      case 'admin-invoices':
        return 'INVOICE MANAGEMENT';
      case 'admin-settings':
        return 'STUDIO SETTINGS';
      default:
        return 'DIRECTOR CRM';
    }
  };

  // Navigation Items matching the specifications
  const navItems = [
    {
      id: 'admin-dashboard' as AppRoute,
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      matchRoutes: ['admin-dashboard', 'admin'],
    },
    {
      id: 'admin-projects' as AppRoute,
      label: 'Projects',
      icon: Layers,
      path: '/admin/projects',
      matchRoutes: ['admin-projects'],
    },
    {
      id: 'admin-clients' as AppRoute,
      label: 'People',
      icon: Users,
      path: '/admin/clients',
      matchRoutes: ['admin-clients'],
    },
    {
      id: 'admin-local-works' as AppRoute,
      label: 'Local Works',
      icon: FolderKanban,
      path: '/admin/local-works',
      badge: pendingLocalWorksCount > 0 ? pendingLocalWorksCount : undefined,
      matchRoutes: ['admin-local-works'],
    },
    {
      id: 'admin-invoices' as AppRoute,
      label: 'Invoices',
      icon: FileText,
      path: '/admin/invoices',
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined,
      matchRoutes: ['admin-invoices'],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex antialiased">
      {/* 1. DESKTOP FIXED SIDEBAR (w-64 fixed inset-y-0 left-0 bg-white border-r) */}
      <aside
        id="director-desktop-sidebar"
        className="hidden md:flex flex-col justify-between w-64 fixed inset-y-0 left-0 bg-white border-r border-zinc-200 z-30 select-none"
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div
                onClick={() => onNavigate('admin-dashboard')}
                className="cursor-pointer group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-[#FF5738] transition-colors">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-tight text-zinc-950">
                      GIZMO DESIGN
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono">
                      DIRECTOR CRM
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="p-3">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Studio Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.matchRoutes.includes(currentRoute);

                return (
                  <button
                    key={item.id}
                    id={`sidebar-link-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#FF5738]' : 'text-zinc-400 group-hover:text-zinc-900'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-200 space-y-3 bg-zinc-50/50">
          {/* Settings Shortcut */}
          <button
            id="sidebar-settings-link"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else onNavigate('admin-settings');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              currentRoute === 'admin-settings'
                ? 'bg-black text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <Settings
              className={`w-4 h-4 ${
                currentRoute === 'admin-settings' ? 'text-[#FF5738]' : 'text-zinc-400'
              }`}
            />
            <span>Settings</span>
          </button>

          {/* Studio WhatsApp Widget (Emerald Container) */}
          <a
            id="sidebar-whatsapp-widget"
            href="https://wa.me/919876543210?text=Director%20Support%20Enquiry%20from%20Gizmo%20Portal"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/80 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-950">Studio WhatsApp</span>
              </div>
              <span className="text-[9px] font-mono font-black px-1.5 py-0.2 bg-emerald-200/70 text-emerald-900 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-emerald-800 font-medium truncate">
                Direct client support
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-900 bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">
                +91 98765 43210
              </span>
            </div>
          </a>

          {/* Director Profile Card */}
          <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-black text-xs">
                  GD
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-zinc-950 truncate">
                  Director / Admin
                </div>
                <div className="text-[10px] text-zinc-400 truncate">gizmo.hub.in@gmail.com</div>
              </div>
            </div>

            {/* Logout / Exit Action */}
            <button
              id="sidebar-logout-btn"
              onClick={() => {
                if (onLogout) onLogout();
                else onNavigate('home');
              }}
              title="Return to Public Site"
              className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CENTER AREA WITH STICKY TOPBAR */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Sticky Topbar (sticky top-0 bg-white/95 backdrop-blur-md) */}
        <header
          id="director-sticky-topbar"
          className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between"
        >
          {/* Left: Mobile Menu Toggle & Dynamic Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle button */}
            <button
              id="mobile-drawer-toggle"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 rounded-xl hover:bg-zinc-100"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs">
              <span
                onClick={() => onNavigate('admin-dashboard')}
                className="text-zinc-400 font-medium hover:text-zinc-800 cursor-pointer hidden sm:inline"
              >
                Gizmo Studio System
              </span>
              <span className="text-zinc-300 hidden sm:inline">/</span>
              <span className="font-extrabold text-zinc-950 tracking-wide text-xs sm:text-sm">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          {/* Right: Actions, Search (if invoice), Notification Center & Public Site Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Bar when in Invoices */}
            {currentRoute === 'admin-invoices' && onSearchChange && (
              <div className="relative hidden lg:block">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoice or client..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-[#FF5738] w-48 transition"
                />
              </div>
            )}

            {/* Notification Center Popover Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                id="btn-notification-center"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-xl border transition relative ${
                  notificationsOpen
                    ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
                title="Notifications & System Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5738] text-white text-[9px] font-black font-mono flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Center Popover Dropdown */}
              {notificationsOpen && (
                <div
                  id="notifications-popover-menu"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-950">
                        Studio Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#FF5738] text-white text-[10px] font-black font-mono">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-bold text-[#FF5738] hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all as read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                    {activeNotifications.length > 0 ? (
                      activeNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 transition-colors cursor-pointer hover:bg-zinc-50 flex items-start gap-2.5 ${
                            !notif.read ? 'bg-amber-50/40' : 'bg-white'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'urgent' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-200" />
                            )}
                            {notif.type === 'payment' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
                            )}
                            {notif.type === 'project' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200" />
                            )}
                            {notif.type === 'info' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 inline-block" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs truncate ${
                                  !notif.read ? 'font-black text-zinc-950' : 'font-bold text-zinc-700'
                                }`}
                              >
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
                              {notif.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-zinc-400">
                        No notifications at this time.
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        onNavigate('admin-local-works');
                      }}
                      className="text-xs font-bold text-zinc-700 hover:text-zinc-950 transition"
                    >
                      View All Production Works →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* "Public Site" Switcher */}
            <button
              id="topbar-public-site-btn"
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. MOBILE DRAWER (w-72 fixed inset-y-0 left-0 z-50 shadow-2xl) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="w-72 fixed inset-y-0 left-0 bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-50">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">
                    G
                  </div>
                  <div>
                    <span className="font-black text-sm text-zinc-950">GIZMO DESIGN</span>
                    <div className="text-[10px] font-bold text-zinc-400">DIRECTOR CRM</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-black rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 mt-5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.matchRoutes.includes(currentRoute);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#FF5738]' : 'text-zinc-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-zinc-200 text-zinc-800">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <button
                onClick={() => {
                  if (onOpenSettings) onOpenSettings();
                  else onNavigate('admin-settings');
                  setMobileDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Studio Settings</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-[#FF5738]" />
                <span>Return to Public Site</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
