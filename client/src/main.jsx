import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter,
	Routes,
	Route,
	RouterProvider,
} from 'react-router-dom';

import './index.css';
import Router from './router/router';
import { store } from './store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
	<Provider store={store}>
		<RouterProvider router={Router} />
	</Provider>,
	document.getElementById('root')
);
