import { GoogleOAuthProvider } from '@react-oauth/google';

import { 
    createContext, 
    useContext, 
    useEffect, 
    useState 
} from 'react';

import {
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence,
} from 'firebase/auth';

import { auth } from '@/services/firebase';
import { apiInstanceExpress } from '@/services/apiInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const listen = async () => {
            try {
                await setPersistence(auth, browserSessionPersistence);
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        setCurrentUser(user);

                        try {
                            const userSignIn = await apiInstanceExpress.post("sign-in", {
                                uid: user.uid,
                                email: user.email,
                            });

                            if (userSignIn.status === 200) setUserData(userSignIn.data.data);
                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        setCurrentUser(null);
                        setUserData(null);
                    }

                    setLoading(false);
                });
                return unsubscribe;
            } catch (error) {
                console.error("Auth error:", error);
                setLoading(false);
            }
        };

        const unsubscribePromise = listen();

        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (typeof unsubscribe === 'function') unsubscribe();
            });
        };
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userData, loading }}>
            <GoogleOAuthProvider clientId="121170964407-5p51s733u6ciofh4ke2jc31q4nlfb66r.apps.googleusercontent.com">
                {children}
            </GoogleOAuthProvider>;
        </AuthContext.Provider>
    );
};