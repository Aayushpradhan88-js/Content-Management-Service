import React, { useState, useParams } from "react";
import { useNavigate } from "react-router-dom";

export const AccountProfile = () => {

    const navigate = useNavigate();
    //-----underdevelopment
    // const {id} = useParams();

    // const userData = fetch(`http://localhost:4000/auth/auth/v1/edit/profile/${id}`);

    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        coverImage: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "coverImage") {
            setForm({ ...form, coverImage: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
        console.log(form);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
            <button onClick={() => navigate('/content')} class="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                Back
            </button>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Cover Image</label>
                    <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                    />
                    {form.coverImage && (
                        <img
                            src={URL.createObjectURL(form.coverImage)}
                            alt="Cover Preview"
                            className="mt-2 h-32 w-full object-cover rounded"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};