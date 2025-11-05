import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Chat from "../components/chat/Chat";
import Account from "../components/account/Account";

export const Content = () => {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);

            try {
                //--------------------FETCHING DATA FROM BACKEND--------------------//
                const response = await fetch(`http://localhost:4000/api/upload/all-uploads`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                //--------------------FETCHING DATA FROM BACKEND--------------------//

                if (!response.ok) {
                    //-----Handles HTTP errors 400 / 500-----//
                    const errorResult = await response.json();
                    throw new Error(errorResult.message || ` HTTP Error status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    setContentItems(result.data);
                }

                else {
                    toast.error(result.message || "Failed to fetch content.");
                }
            }

            catch (error) {
                console.log(error.message);
                // toast.error(`Error failed to fetched content ${error.message}`);
            }

            finally {
                setIsLoading(false);
            }

        }

        fetchContent();
    }, [navigate])
    return (
        <div className="bg-black text-white font-sans">
            <div className="flex flex-col md:flex-row min-h-screen">

                {/*----------Sidebar---------- */}
                <aside className="w-full md:w-1/5 bg-black border-r border-gray-800 p-4">
                    <div className="text-xl font-bold mb-8">LOGO</div>
                    <nav className="space-y-4">
                        <a href="#" className="block">videos</a>
                        <Link to="/profile" className="block">My Content</Link>
                        <Link to="/demoprofile" className="block">Dummy Content</Link>
                        <a href="#" className="block">tweets</a>
                        <a href="#" className="block">likes</a>
                        <a href="" className="block">Image</a>
                        <a href="#" className="block">files</a>
                        <a href="#" className="block">Logout</a>
                    </nav>
                </aside>

                {/*----------Main content----------*/}
                <main className="flex-1 p-4">
                    {/*-----Top bar with search and upload-----*/}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center w-full md:w-3/4 bg-gray-800 rounded px-3 py-1">
                            {/*-----Search Box-----*/}
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent focus:outline-none w-full"
                            />
                            <button className="mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
                                </svg>
                            </button>
                        </div>

                        {/* UPLOAD SECTION */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/upload')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                + Upload
                            </button>
                        </div>
                        {/* UPLOAD SECTION */}

                        {/* ACCOUNT SECTION */}
                        <Account />
                  
                    </div>

                    {/* Content gallery */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Your Contents</h2>
                        {
                            isLoading ? (
                                <p className="text-xl font-semibold my-6">Loading Content...</p>
                            ) : contentItems.length === 0 ? (
                                <p className="text gray-500">No Content Uploaded Yet</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {contentItems.map((item) => (
                                        <Link
                                            key={item.public_id || item._id}
                                            to={item.contentType === 'video' ? `/watch?id=${item._id}` : `/${item.contentType}?id=${item._id}`}
                                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer block"
                                        >

                                            {/*--- Image ---*/}
                                            {item.contentType === 'image' && (
                                                <img src={item.thumbnail || item.url}
                                                    alt={item.title || 'uploaded image'}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}

                                            {/*--- Video ---*/}
                                            {item.contentType === 'video' && (
                                                <video
                                                    controls
                                                    src={item.url}
                                                    poster={item.thumbnail}
                                                    className="w-full h-48 object-cover"

                                                />

                                            )}

                                            {/*--- File ---*/}
                                            {item.contentType === 'file' && (
                                                <div
                                                    className="w-full h-48 flex items-center justify-center bg-gray-700 p-3">
                                                    <span className="text-gray-400 text-sm text-center">📄 {item.title || 'File'}</span>
                                                </div>
                                            )}

                                            <div className="p-3">
                                                <h3 className="text-md font-semibold truncate text-gray-100" title={item.title}>{item.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )
                        }

                    </div>

                    {/* ContentSECTION */}

                    {/* CHAT SECTION */}

                    <Chat />

                    {/* CHAT SECTION */}
                </main>
            </div>
        </div>
    );
};
