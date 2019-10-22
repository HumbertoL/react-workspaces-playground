// Material-UI Dependencies
import {
	common,
	deepOrange,
	green,
	lightBlue,
	red
} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

const defaultTheme = createMuiTheme({});

const hoverBgColor = defaultTheme.palette.action.hover;

// const deepOrange700 = deepOrange[700];
const poppyRed = '#FF4A29';
const deepIndigo = '#344A70';

// Theme Definition
export default createMuiTheme({
	overrides: {
		MuiButton: {
			root: {
				fontFamily: 'Circular,serif',
				textTransform: 'none',
				color: poppyRed,
				'&:hover': {
					backgroundColor: hoverBgColor
				}
			},
			textPrimary: {
				color: poppyRed,
				'&:hover': {
					backgroundColor: hoverBgColor
				}
			},
			outlinedPrimary: {
				border: `1px solid ${poppyRed}`,
				color: poppyRed,
				'&:hover': {
					backgroundColor: hoverBgColor,
					border: `1px solid ${poppyRed} !important`
				}
			},
			outlinedSecondary: {
				backgroundColor: common.white,
				border: `1px solid ${poppyRed}`,
				'&:hover': {
					backgroundColor: hoverBgColor,
					border: `1px solid ${poppyRed}`
				}
			},
			containedPrimary: {
				backgroundColor: poppyRed,
				boxShadow: 'none',
				color: common.white,
				'&:hover': {
					backgroundColor: deepOrange.A700
				}
			}
		}
	},
	palette: {
		...defaultTheme.palette,
		border: defaultTheme.palette.grey[300],
		primary: lightBlue,
		secondary: {
			...deepOrange,
			main: poppyRed
		},
		text: {
			...defaultTheme.palette.text,
			primary: deepIndigo,
			secondary: '#8894a9',
			light: common.white
		},
		error: {
			...defaultTheme.palette.error,
			light: red[50],
			dark: red[300]
		},
		success: {
			light: green[50],
			main: green[300],
			dark: green[500]
		}
	},
	typography: {
		...defaultTheme.typography,
		fontFamily: 'Circular,serif',
		body1: {
			...defaultTheme.typography.body1,
			fontFamily: 'Circular,serif'
		}
	}
});
