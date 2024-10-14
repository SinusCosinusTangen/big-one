import { useState } from 'react';
import '../output.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import google from '../asset/image/7123025_logo_google_g_icon.svg';
import { Login } from '../services/AuthService';

const LoginForm = () => {
    const [inputType, setInputType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMethod, setLoginMethod] = useState("username/email");

    const inputClass = `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                        invalid:border-pink-500 invalid:text-pink-600
                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500`;

    const inputPasswordClass = `${inputClass} pr-8`;

    const handleShowPassword = () => {
        if (inputType === 'password') {
            setInputType('text');
            setIcon(eye);
        } else {
            setInputType('password');
            setIcon(eyeOff);
        }
    };

    const handleLogin = async () => {
        await Login(username, username, password, loginMethod);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="max-w-sm mx-auto p-4">
            <p className="mt-2 text-lg">Username/Email</p>
            <input 
                type="text" 
                className={inputClass} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />
            <p className="mt-2 text-lg">Password</p>
            <div className="relative flex items-center mb-2">
                <input 
                    type={inputType} 
                    className={inputPasswordClass} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <span className="absolute right-2 cursor-pointer" onClick={handleShowPassword}>
                    <Icon icon={icon} size="15" />
                </span>
            </div>
            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
            
            <button 
                className="mt-6 block w-full h-10 px-3 py-2 bg-sky-500 text-white text-sm font-semibold rounded-md shadow-sm 
                          hover:bg-sky-600 active:bg-sky-700 focus:ring focus:ring-sky-300"
                type="submit"
            >
                Sign In
            </button>
            <div className="relative flex items-center mt-2">
                <button 
                    className="flex items-center justify-center w-full h-10 px-3 py-1 bg-white border border-sky-500 rounded-md text-sky-500 text-sm shadow-sm 
                               font-semibold hover:bg-sky-500 hover:text-white active:bg-sky-600 focus:ring focus:ring-sky-300"
                    onClick={() => console.log('submitted')}
                    type="button"
                >
                    <span className="flex items-center cursor-pointer">
                        <img src={google} alt="Google logo" width={30} />
                        <span className="ml-2">Sign In with Google</span>
                    </span>
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
