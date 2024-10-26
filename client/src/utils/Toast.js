import { toast } from 'react-hot-toast'

const ToastError = (noti) => {
	return toast.error(noti, {
		duration: 3000,
		position: 'top-right',

		// Styling
		style: {},
		className: '',

		// Aria
		ariaProps: {
			role: 'status',
			'aria-live': 'polite',
		},
	});
}

const ToastSuccess = (noti) => [
	toast.success(noti, {
		duration: 2000,
		position: 'top-right',

		// Styling
		style: {},
		className: '',

		// Aria
		ariaProps: {
			role: 'status',
			'aria-live': 'polite',
		},
	})
]

export {ToastError,ToastSuccess}