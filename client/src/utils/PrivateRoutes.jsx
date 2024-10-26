import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { redirect, useNavigate } from 'react-router-dom';
import { SET_USER } from '../store/feature/auth';

const AuthContext = createContext();
// export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = ({ children }) => {
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem('user');

		console.log('auth :', user);

		if (user != null) {
			console.log('user null');
			dispatch(SET_USER(user));
		} else {
			console.log('sjdkfjsdjf');
			navigate('/login');
		}
	}, []);

	return <AuthContext.Provider value={AuthContext}>{children}</AuthContext.Provider>;
};
