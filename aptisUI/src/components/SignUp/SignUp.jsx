import React, { useEffect, useState } from 'react';
import './SignUp.css';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from 'react-admin';
import dataProvider from '../../providers/dataProviders/dataProvider';

function SignUp() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm();
	const [idTele, setIdTele] = useState('');
	const [isShow, setIsShow] = useState(false);

	const onSignUp = async (data) => {

		console.log(data);





		try {
			const createUser = await dataProvider.create('access/signup', {
				data
			});



		alert('Sign up success');
			// navigate('/');
			console.log('new user:', createUser);
		} catch (error) {
			console.log({ error });
			setIsShow(false);
		}
	};

	useEffect(() => {
		const currentUrl = window.location.href;
		const url = new URL(currentUrl);
		const searchParams = new URLSearchParams(url.search);
		const id = searchParams.get('id');
		if (id) {
			setIdTele(id);
			return;
		}
	}, []);

	return (
		<>
				<div className="container sign-up-mode">
					<div className="forms-container">
						<div className="signin-signup">
							<form onSubmit={handleSubmit(onSignUp)} className="form sign-up-form">
								<h2 className="title">Sign up</h2>
								<div className="input-field">
									<i className="fas fa-user"></i>
									<input
										type="text"
										{...register('name', { required: true })}
										placeholder="Username"
									/>
									{errors.name && <span>This field is required</span>}
								</div>
								<div className="input-field">
									<i className="fas fa-envelope"></i>
									<input
										type="email"
										{...register('email', { required: true })}
										placeholder="Email"
									/>
									{errors.email && <span>This field is required</span>}
								</div>
								<div className="input-field">
									<i className="fas fa-lock"></i>
									<input
										type="password"
										{...register('password', { required: true })}
										placeholder="Password"
									/>
									{errors.password && <span>This field is required</span>}
								</div>
								<div className="input-field">
									<i className="fas fa-lock"></i>
									<input
										type="password"
										placeholder="Confirm Password"
									/>
								</div>
								<div className=" flex justify-center items-center" style={{ pointerEvents: 'auto' }}>
									<div><Button variant='container' color='primary' type="submit">Submit</Button></div>
								</div>
							</form>
						</div>
					</div>

				</div>
		</>
	);
}

export default SignUp;
