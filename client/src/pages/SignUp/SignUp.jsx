import React, { useEffect, useState } from 'react';
import './SignUp.css';
import AccessService from '../../services/API/access.service';
import { toast, Toaster } from 'react-hot-toast';
import {
	useNavigation,
	useNavigate,
	NavLink,
	Navigate,
	useParams,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import SpinnerLoading from '../../components/ui/SpinnerLoading/SpinnerLoading';

function SignUp() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [idTele, setIdTele] = useState('');
	const [isShow, setIsShow] = useState(false);
	const [formValues, setFormValues] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};
	const onSignUp = async () => {
		try {
			setIsShow(true)
			const createUser = await AccessService.signUp({
				name: formValues.name,
				email: formValues.email,
				password: formValues.password,
				idTelegram: idTele,
			});
			toast.success('Đăng ký thành công', {
				duration: 4000,
				position: 'top-center',

				// Styling
				style: {},
				className: '',

				// Aria
				ariaProps: {
					role: 'status',
					'aria-live': 'polite',
				},
			});
			setIsShow(false)
			navigate('/login');

			console.log('new user:', createUser);
		} catch (error) {
			console.log({ error });
			setIsShow(false)
		}
	};

	useEffect(() => {
		// Lấy URL hiện tại
		const currentUrl = window.location.href;

		// Tạo một đối tượng URL từ URL hiện tại
		const url = new URL(currentUrl);

		// Lấy đối tượng URLSearchParams từ query string của URL
		const searchParams = new URLSearchParams(url.search);

		// Lấy giá trị của tham số 'id'
		const id = searchParams.get('id');
		if (id) {
			setIdTele(id);
			return;
		}
	}, []);
	return (
		<>
			<SpinnerLoading show={isShow}>
				<div className="container sign-up-mode">
					<div className="forms-container">
						<div className="signin-signup">
							<div action="#" className="form sign-up-form">
								<h2 className="title">Sign up</h2>
								<div className="input-field">
									<i className="fas fa-user"></i>
									<input
										type="text"
										name="name"
										value={formValues.name}
										onChange={handleInputChange}
										placeholder="Username"
									/>
								</div>
								<div className="input-field">
									<i className="fas fa-envelope"></i>
									<input
										type="email"
										name="email"
										value={formValues.email}
										onChange={handleInputChange}
										placeholder="Email"
									/>
								</div>
								<div className="input-field">
									<i className="fas fa-lock"></i>
									<input
										type="password"
										name="password"
										value={formValues.password}
										onChange={handleInputChange}
										placeholder="Password"
									/>
								</div>
								<div className="input-field">
									<i className="fas fa-lock"></i>
									<input
										type="password"
										placeholder="Comfirm Password"
									/>
								</div>
								<div
									className="btn flex justify-center items-center"
									style={{ pointerEvents: 'auto' }}
									onClick={onSignUp}
								>
									<div>Submit</div>
								</div>
							</div>
						</div>
					</div>

					<div className="panels-container">
						<div className="panel right-panel">
							<div className="content ">
								<h3>One of us ?</h3>
								<p>
									Lorem ipsum dolor sit amet consectetur adipisicing
									elit. Nostrum laboriosam ad deleniti.
								</p>
								<div className="flex justify-center">
									<NavLink
										to="/login"
										className="btn w-fit h-fit p-2 form transparent"
										id="sign-in-btn"
									>
										Sign in
									</NavLink>
								</div>
							</div>
						</div>
					</div>
					<Toaster />
				</div>
			</SpinnerLoading>
		</>
	);
}

export default SignUp;
