import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Toast } from '../../components/toast/Toast'

export const Login = () => {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChangeValue = (e) =>
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        )

    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVjOGUxNjEwYjYyZDhhNjI5MTQ0NGYiLCJpYXQiOjE3NTA5MzUxMzQsImV4cCI6MTc1MTUzOTkzNH0.aoKCWqSttGM2quFL6_s8R8Tvs9hb5RYpLqxv9oxP7w,  id = 685c8e1610b62d8a6291444f


    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            //FETCHING DATA
            const res = await fetch(`http://localhost:4000/api/auth/v1/login`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            )

            const data = await res.json()

            //Storing data in LOCALSTORAGE
            if (res.ok) {
                if (data.data && data.data.token) {
                    localStorage.setItem("token", data.data.token);
                }
                // Store user data if it exists
                if (data.data && data.data.user) {
                    localStorage.setItem("user", JSON.stringify(data.data.user));
                }
                navigate("/content");
            } else {
                alert(data.message || "signup failed");
                Toast.error("Signup Failed");
            }
        } catch (err) {
            console.log("Registration error:", err.response ? err.response.data : err.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-md shadow-lg">
                <h2 className="text-3xl font-bold text-purple-500 text-center mb-2">Login</h2>
                <p className="text-center text-purple-300 mb-6">If you already a member, easily log in</p>

                <form onSubmit={handleLogin}>
                    {/* USER EMAIL */}
                    <input
                        onChange={handleChangeValue}
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        name='email'
                        value={form.email}
                    />
                    {/* USER PASSWORD */}
                    <input
                        onChange={handleChangeValue}
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-6 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        name='password'
                        value={form.password}
                    />

                    {/* SUBMIT BUTTON */}
                    <button
                        type='submit'
                        className="w-full bg-purple-600 hover:bg-purple-700 transition-colors p-3 rounded-lg font-semibold mb-6"
                        disabled={loading}>
                        Login
                    </button>
                </form>

                <div className="flex items-center justify-between mb-6">
                    <span className="border-b border-gray-600 w-1/4"></span>
                    <span className="text-gray-400">OR</span>
                    <span className="border-b border-gray-600 w-1/4"></span>
                </div>

                {/* GOOGLE LOGIN */}
                <button className="w-full flex items-center justify-center bg-black border border-white p-3 rounded-lg hover:bg-white hover:text-black transition-colors mb-4">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 mr-2" />
                    Login with Google
                </button>

                {/* REGISTER */}
                <div className="text-center text-sm">
                    If you don't have an account? <Link to="/register" className="ml-2 text-purple-400 hover:underline font-semibold">Register</Link>
                </div>

                <button
                    className="py  mt-4 text-sm text-gray-400 hover:underline"
                >
                    <Link to="/"> ← Back</Link>

                </button>
            </div>
        </div>

    )
}