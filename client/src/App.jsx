import React, { useLayoutEffect } from 'react';
import Navigation from './components/Navbar/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SET_USER } from './store/feature/auth';
import SignIn from './pages/Login/SignIn';
const App = () => {
	const navigation = useNavigate();
	const dispatch = useDispatch();
	const auths = useSelector((state) => state.authStore.user);

	/// *********** Nội dung khởi taoj ban đầu ở dây *************************
	useLayoutEffect(() => {
		// const userId = localStorage.getItem('userId');
		// // const listText = localStorage.getItem('listText')
		// const accessToken = localStorage.getItem('accessToken');
		const user = JSON.parse(localStorage.getItem('user'));
		if (!user) {
			navigation('/login');
		} else {
			dispatch(SET_USER(user));
			// setIsAuth(true)
		}
	}, []);
	return (
		<>
			{/* {auths != '' ? ( */}
				<div className="App">
					<div className="AppGlass">
						<Navigation />
						<Outlet />
					</div>
					<Toaster />
				</div>
			{/* ) : (
				<SignIn />
			)} */}
		</>
	);
};

export default App;
