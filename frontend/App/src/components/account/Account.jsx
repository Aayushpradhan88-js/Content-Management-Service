import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, User, Monitor, Globe } from "lucide-react";
import fetch from 'fetch';


const Account = () => {
    const [open, setOpen] = useState(false);
    const userid = '685e2a34b7eec1e3cef9eaed'

    const userId = fetch(`http://locahost:4000/api/v1/auth/user/${userid}`);

    //----------FETCHING BACKEND----------//
    try {
        const logout = await fetch(`http://localhost:4000/api/auth/v1/logout`)
    } catch (error) {
        
    }
    //----------FETCHING BACKEND----------//

    return (
        <div className="relative flex justify-end bg-red-950">
            {/* Profile Section */}
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 p-2 cursor-pointer rounded-full hover:bg-gray-800 transition"
                >
                    <img
                        src="https://via.placeholder.com/40"
                        alt="profile"
                        className="w-10 h-10 rounded-full border"
                    />
                </button>


                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-72 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">Ayush</p>
                                    <p className="text-sm text-gray-400">@asyncayush_JS</p>
                                    {/* <Link to="/account/profile/info" className="text-blue-400 text-sm hover:underline">Edit Youre profile</Link> */}
                                    <Link to={`/account/profile/edit/${userid}`} className="text-blue-400 text-sm hover:underline">Edit Youre profile</Link>
                                </div>
                            </div>
                        </div>


                        <ul className="p-2">
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <User size={18} /> Google Account
                            </li>
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <Globe size={18} /> Language: English
                            </li>
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <Monitor size={18} /> Appearance: Dark Theme
                            </li>
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <Settings size={18} /> Settings
                            </li>
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer text-red-400">
                                <LogOut size={18} /> Sign Out
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Account;
