import { useEffect, useState } from "react";
import bg from '../../asset/image/bg-img.jpeg'
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import { GetPublicKey } from "../../services/AuthService";

const AuthPage = () => {

    const style = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }
    const [authState, setAuthState] = useState('login');

    useEffect(() => {
        GetPublicKey();
    }, []);

    var loginButtonClass = "border-t-8 border-slate-200 w-1/2 py-4 bg-slate-200 rounded-tl text-slate-500 text-xl"
    var signupButtonClass = "border-t-8 border-slate-200 w-1/2 py-4 bg-slate-200 rounded-tr text-slate-500  text-xl"

    if (authState === 'login') {
        loginButtonClass = "border-t-8 border-blue-500 w-1/2 py-4 rounded-tl font-semibold text-xl"
    } else {
        var signupButtonClass = "border-t-8 border-blue-500 w-1/2 py-4 rounded-tr font-semibold text-xl"
    }

    return (
        <div className="h-screen font-sans overflow-y-auto bg-slate-700/30" style={style}>
            <div className="absolute z-50 inset-0 flex justify-center items-center">
                <div className="relative bg-white border border-gray-300 rounded shadow-lg max-w-md w-full">
                    <button className={loginButtonClass} onClick={() => setAuthState('login')}>Login</button>
                    <button className={signupButtonClass} onClick={() => setAuthState('signup')}>Sign Up</button>
                    <div className="m-4">
                        {authState === 'login' ? <LoginForm /> : <SignupForm />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;