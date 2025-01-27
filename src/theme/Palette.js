import { colors } from '@material-ui/core'

const white = '#FFFFFF'
const black = '#000000'

export default {
    main: {
        palette: {
            black,
            white,
            primary: {
                contrastText: white,
                dark: colors.blue[900],
                main: colors.blue[500],
                light: colors.blue[100]
            },
            secondary: {
                contrastText: white,
                dark: colors.orange[900],
                main: colors.orange[500],
                light: colors.orange[100]
            },
            success: {
                contrastText: white,
                dark: colors.green[900],
                main: colors.green[600],
                light: colors.green[400]
            },
            info: {
                contrastText: white,
                dark: colors.blue[900],
                main: colors.blue[600],
                light: colors.blue[400]
            },
            warning: {
                contrastText: white,
                dark: colors.orange[900],
                main: colors.orange[600],
                light: colors.orange[400]
            },
            error: {
                contrastText: white,
                dark: colors.red[900],
                main: colors.red[600],
                light: colors.red[400]
            },
            text: {
                link: colors.blue[600],
                primary: colors.blueGrey[900],
                secondary: colors.blueGrey[600]
            },
            background: {
                paper: white,
                default: '#F4F6F8'
            },
            icon: colors.blueGrey[600],
            divider: colors.grey[200]
        }
    }
}