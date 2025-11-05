import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'


export const Register = () => {

    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChangeValue = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        )
    }
    
    //----------SUBMITING DATA----------//
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            //FETCHING DATA
            const res = await fetch(`http://localhost:4000/api/auth/v1/register`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            )

            const data = await res.json();
            //Storing data in LOCALSTORAGE
            if (res.ok) {
                if(data.data && data.data.token){
                    localStorage.setItem("token", data.data.token);
                }

                if(data.data && data.data.user){
                    localStorage.setItem("user", JSON.stringify(data.data.user));
                }
                navigate("/content");
            } else {
                alert(data.message || "signup failed")
            }
        } catch (err) {
            console.log("Registration error:", err.response ? err.response.data : err.message)
        } finally {
            setLoading(false);
        }

    }
    return (
        < div className="min-h-screen flex items-center justify-center bg-gray-900" >
            <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-md shadow-lg">
                <h2 className="text-3xl font-bold text-purple-500 text-center mb-6">Register</h2>

                <form onSubmit={handleSubmit} >
                    {/* USER USERNAME */}
                    <input
                        onChange={handleChangeValue}
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        name='username'
                        value={form.username}
                    />

                    {/* USER FIRSTNAME */}
                    <input
                        onChange={handleChangeValue}
                        type="text"
                        placeholder="First Name"
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        name='firstname'
                        value={form.firstname}
                    />

                    {/* USER LASTNAME */}
                    <input
                        onChange={handleChangeValue}
                        type="text"
                        placeholder="Last Name"
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        name='lastname'
                        value={form.lastname}
                    />

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

                    {/* USER SIGNUP BUTTON */}
                    <button 
                    type="submit" 
                    className="w-full bg-purple-600 pointer hover:bg-purple-700 transition-colors p-3 rounded-lg font-semibold mb-6"
                    disabled={loading}>
                        Sign Up
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

                {/* LOGIN */}
                <div className="text-center text-sm">
                    If you already have an account?
                    <Link to="/login" className="ml-2 text-purple-400 hover:underline font-semibold">Login</Link>
                </div>
                <button
                    className="py  mt-4 text-sm text-gray-400 hover:underline"
                >
                    <Link to="/"> ← Back</Link>

                </button>
            </div>
        </div >
    )
}