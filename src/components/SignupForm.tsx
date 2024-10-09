import { useState } from 'react';
import '../output.css'
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import google from '../asset/image/7123025_logo_google_g_icon.svg'

const SignupForm = () => {

    const [inputType, setInputType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);

    var inputClass = `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                      invalid:border-pink-500 invalid:text-pink-600
                      focus:invalid:border-pink-500 focus:invalid:ring-pink-500`
    var inputPasswordClass = inputClass + ' pr-8'

    const handleShowPassword = () => {
        if (inputType === 'password') {
            setInputType('text');
            setIcon(eye);
        } else {
            setInputType('password');
            setIcon(eyeOff);
        }
    }

    return (        
        <form onSubmit={() => console.log('submitted')}>
            <p className="mt-2">Email</p>
            <input type="email" className={inputClass}/>
            <p className="mt-2">Username</p>
            <input type="text" className={inputClass}/>
            <p className="mt-2">Password</p>
            <div className="relative flex items-center mb-2">
                <input type={inputType} className={inputPasswordClass}/>
                <span className="absolute right-2 cursor-pointer" onClick={handleShowPassword}>
                    <Icon icon={icon} size="15"></Icon>
                </span>
            </div>
            <p className="mt-2">Confirm Password</p>
            <div className="relative flex items-center mb-2">
                <input type={inputType} className={inputPasswordClass}/>
                <span className="absolute right-2 cursor-pointer" onClick={handleShowPassword}>
                    <Icon icon={icon} size="15"></Icon>
                </span>
            </div>
            
            <button className="mt-8 block w-full h-10 px-3 py-2 bg-white border border-sky-500 rounded-md text-sky-500 text-sm shadow-sm 
                font-semibold hover:bg-sky-500 hover:text-white active:bg-sky-600 focus:ring focus:ring-sky-300"
                onClick={() => console.log('submitted')}>Sign Up
            </button>
            <div className="relative flex items-center mt-2">
                <button className="flex items-center justify-center w-full h-10 px-3 py-1 bg-white border border-sky-500 rounded-md text-sky-500 text-sm shadow-sm 
                    font-semibold hover:bg-sky-500 hover:text-white active:bg-sky-600 focus:ring focus:ring-sky-300"
                    onClick={() => console.log('submitted')}>
                    <span className="flex text-center items-center cursor-pointer">
                        <img src={google} width={30}/>
                        Sign Up with Google
                    </span>
                </button>
            </div>
        </form>
    );
};

export default SignupForm;