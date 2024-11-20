import { useEffect, useState } from "react";
import bg from '../../asset/image/bg-img.jpeg'
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import { getPublicKey } from "../../services/AuthService";
import { OFFLINE, ONLINE } from "../../constant/Value";
import { checkMiddlewareStatus } from "../../services/LandingPageService";

const AuthPage = () => {

    const style = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }
    const [authState, setAuthState] = useState('login');
    const [serverStat, setServerStat] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicKey = async () => {
            const publicKey = await getPublicKey();
            if (publicKey) {
                setLoading(false);
            }
        };

        const checkMiddlewareStat = async () => {
            const appState = await checkMiddlewareStatus();
            setServerStat(appState);
            setLoading(false);

            if (appState == 'ONLINE') {
                fetchPublicKey();
            }
        }

        checkMiddlewareStat();
    }, []);

    var loginButtonClass = "border-t-8 border-slate-200 w-1/2 py-4 bg-slate-200 rounded-tl text-slate-500 text-xl"
    var signupButtonClass = "border-t-8 border-slate-200 w-1/2 py-4 bg-slate-200 rounded-tr text-slate-500  text-xl"

    if (authState === 'login') {
        loginButtonClass = "border-t-8 border-blue-500 w-1/2 py-4 rounded-tl font-semibold text-xl"
    } else {
        signupButtonClass = "border-t-8 border-blue-500 w-1/2 py-4 rounded-tr font-semibold text-xl"
    }

    return (
        <div className="h-screen font-sans overflow-y-auto bg-slate-700/30" style={style}>
            <div className="absolute z-50 inset-0 flex justify-center items-center">
                <div className="relative bg-white border border-gray-300 rounded shadow-lg max-w-md w-full">
                    {loading && (
                        <div className="h-fit w-screen overlay p-4 md:p-6 bg-white shadow-lg rounded-lg max-w-full md:max-w-md mx-auto transition-transform duration-200">Loading...</div>
                    )}
                    {serverStat === ONLINE && (
                        <div>
                            <button className={loginButtonClass} onClick={() => setAuthState('login')}>Login</button>
                            <button className={signupButtonClass} onClick={() => setAuthState('signup')}>Sign Up</button>
                            <div className="m-4">
                                {authState === 'login' ? <LoginForm /> : <SignupForm />}
                            </div>
                        </div>
                    )}
                    {serverStat === OFFLINE && (
                        <div className="m-4">
                            <h1 className="text-red-500 font-bold text-center text-4xl">OFFLINE</h1>
                            <h1 className="mb-2">My servers are currently offline. Cannot authenticate you right now. Please try again later!</h1>
                            <a href="/" className="text-blue-500 hover:underline">Back to Homepage</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;