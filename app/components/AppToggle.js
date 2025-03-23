'use client';
import { useState } from 'react';

export default function AppToggle({ appName, setAppName }) {
  const [open, setOpen] = useState(false);
  const apps = ['Desibhabhi Nights', 'Lusty Hub'];

  return (
    <div className="relative w-full cursor-pointer">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full bg-slate-700 text-white font-semibold px-4 py-3 rounded-lg flex justify-between items-center"
      >
        {appName}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="white"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown List */}
      {open && (
        <ul className="cursor-pointer absolute w-full mt-2 bg-slate-800 rounded-lg shadow-lg z-10">
          {apps.map((app) => (
            <li
              key={app}
              onClick={() => {
                setAppName(app);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-slate-600 text-white ${
                app === appName ? 'font-semibold' : ''
              }`}
            >
              {app}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
