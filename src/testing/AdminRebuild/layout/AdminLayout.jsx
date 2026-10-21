import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  MessageSquare,
  CalendarDays,
  ClipboardCheck,
  UserRound,
  LogOut,
  Volume2,
  VolumeX,
} from "lucide-react";
import AdminSidebar, { LogoutDialog } from "./AdminSidebar";

const MUTE_KEY = "beardista-admin-notifications-muted";
const OPENING_HOUR = 16; // The café opens at 4:00 PM.

const sampleNotifications = [
  {
    id: "survey-1",
    icon: MessageSquare,
    title: "New survey response",
    message: "Alex Morgan rated their visit 5 stars.",
    time: "5 min ago",
    link: "/admin/analytics?response=1",
    read: false,
  },
  {
    id: "event-join",
    icon: CalendarDays,
    title: "Someone joined an event",
    message: "Bianca Cruz joined the Latte Art Throwdown.",
    time: "1 hr ago",
    link: "/admin/events?tab=participants",
    read: false,
  },
  {
    id: "opening-check",
    icon: ClipboardCheck,
    title: "Opening check",
    message: "These items were unavailable yesterday. Still unavailable today?",
    items: ["Spanish Latte", "Blueberry Cheesecake", "Matcha Cold Brew"],
    time: "4:00 PM",
    read: false,
  },
];

// Arrives 15 seconds after the first click so the sound can be tested.
const demoNotification = {
  id: "survey-2",
  icon: MessageSquare,
  title: "New survey response",
  message: "Jamie Santos rated their visit 5 stars.",
  time: "Just now",
  link: "/admin/analytics?response=2",
  read: false,
};

let audioContext = null;

// Browsers only allow sound after the user has interacted with the page.
function unlockAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
}

// Short two-note chime made with the Web Audio API (no sound file needed).
function playChime() {
  if (!audioContext || audioContext.state !== "running") return;

  const now = audioContext.currentTime;
  [880, 1320].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = now + index * 0.12;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.45);
  });
}

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

function NotificationItem({ notification, openingAnswer, onOpen, onAnswer }) {
  const { icon: Icon, title, message, time, items, read } = notification;

  const content = (
    <>
      <span
        className={`mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex ${
          read ? "bg-gray-100 text-gray-400" : "bg-orange-50 text-[#E58422]"
        }`}
      >
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`text-sm ${
              read ? "font-semibold text-gray-600" : "font-bold text-[#19244E]"
            }`}
          >
            {title}
          </span>
          <span className="shrink-0 text-[11px] text-gray-400">{time}</span>
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-gray-500">
          {message}
        </span>
      </span>

      {!read && (
        <span
          aria-label="Unread"
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E58422]"
        />
      )}
    </>
  );

  if (!items) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex gap-3">{content}</div>

      <ul className="mt-2 flex flex-wrap gap-1.5 sm:pl-12">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-3 sm:pl-12">
        {openingAnswer ? (
          <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-[#19244E]">
            {openingAnswer === "yes"
              ? "Kept as unavailable for today."
              : "Marked as available again."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAnswer("yes")}
              className="min-h-11 rounded-xl bg-[#19244E] px-3 text-xs font-bold text-white transition hover:bg-[#27376f]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onAnswer("no")}
              className="min-h-11 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLayout({
  activePage = "Dashboard",
  children,
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [openingAnswer, setOpeningAnswer] = useState(null);
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);
  const notificationsRef = useRef(null);
  const accountRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!mobileOpen) return;

    const close = () => setMobileOpen(false);
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    // Matches Tailwind's lg breakpoint, where the sidebar is always shown.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onScreenChange = (event) => {
      if (event.matches) close();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onScreenChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onScreenChange);
    };
  }, [mobileOpen]);

  // Close the open header menu on a tap outside it or on Escape.
  useEffect(() => {
    if (!openMenu) return;

    const menuRef = openMenu === "notifications" ? notificationsRef : accountRef;
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    mutedRef.current = muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  }, [muted]);

  // Unlock sound on the first click, then deliver a sample notification 15 seconds later.
  useEffect(() => {
    let timer;
    const onFirstClick = () => {
      unlockAudio();
      timer = setTimeout(() => {
        setNotifications((current) =>
          current.some((item) => item.id === demoNotification.id)
            ? current
            : [demoNotification, ...current]
        );
        if (!mutedRef.current) playChime();
      }, 15000);
    };

    document.addEventListener("click", onFirstClick, { once: true });
    return () => {
      document.removeEventListener("click", onFirstClick);
      clearTimeout(timer);
    };
  }, []);

  // When 4:00 PM passes while the page is open, the opening check comes back as new.
  useEffect(() => {
    let wasOpen = new Date().getHours() >= OPENING_HOUR;
    const timer = setInterval(() => {
      const isOpen = new Date().getHours() >= OPENING_HOUR;
      if (isOpen && !wasOpen) {
        setOpeningAnswer(null);
        setNotifications((current) =>
          current.map((item) =>
            item.id === "opening-check" ? { ...item, read: false } : item
          )
        );
        if (!mutedRef.current) playChime();
      }
      wasOpen = isOpen;
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = (menu) =>
    setOpenMenu((current) => (current === menu ? null : menu));

  const markRead = (id) =>
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );

  const markAllRead = () =>
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );

  const openNotification = (notification) => {
    markRead(notification.id);
    setOpenMenu(null);
    navigate(notification.link);
  };

  const answerOpeningCheck = (answer) => {
    setOpeningAnswer(answer);
    markRead("opening-check");
  };

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-gray-900">
      <AdminSidebar
        activePage={activePage}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen min-w-0 lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-gray-100 bg-white/95 px-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
              <span>Admin</span>
              <span>/</span>
              <span className="font-bold text-[#19244E]">{activePage}</span>
            </div>

            <p className="truncate text-sm font-bold text-[#19244E] sm:hidden">
              {activePage}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 md:flex">
              <Search size={16} className="text-gray-400" />
              <span className="text-xs text-gray-400">Search anything...</span>
            </div>

            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("notifications")}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-haspopup="true"
                aria-expanded={openMenu === "notifications"}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E58422] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Phones: full-width panel under the header. Larger screens: dropdown under the bell. */}
              {openMenu === "notifications" && (
                <div className="fixed inset-x-3 top-[4.25rem] z-40 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pl-4 pr-1">
                    <p className="py-3 text-sm font-extrabold text-[#19244E]">
                      Notifications
                    </p>
                    <div className="flex items-center">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="min-h-11 px-2 text-xs font-bold text-[#E58422] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setMuted((value) => !value)}
                        aria-pressed={muted}
                        aria-label={muted ? "Unmute notification sound" : "Mute notification sound"}
                        title={muted ? "Sound off" : "Sound on"}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-[#19244E]"
                      >
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                    </div>
                  </div>

                  <ul className="max-h-[calc(100vh-6rem)] divide-y divide-gray-100 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <NotificationItem
                          notification={notification}
                          openingAnswer={openingAnswer}
                          onOpen={() => openNotification(notification)}
                          onAnswer={answerOpeningCheck}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("account")}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={openMenu === "account"}
                className="flex h-11 w-11 items-center justify-center rounded-full"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#19244E] text-xs font-bold text-white transition hover:ring-4 hover:ring-gray-100">
                  AD
                </span>
              </button>

              {openMenu === "account" && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-bold text-[#19244E]">Administrator</p>
                    <p className="text-xs text-gray-400">Owner</p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/admin/account");
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <UserRound size={18} className="text-gray-400" />
                    My Account
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      setLogoutOpen(true);
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-rose-600 transition hover:bg-[#d47414]"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Kept outside <header>: its backdrop blur would trap a fixed overlay inside it. */}
      <LogoutDialog open={logoutOpen} onCancel={() => setLogoutOpen(false)} />
    </div>
  );
}
