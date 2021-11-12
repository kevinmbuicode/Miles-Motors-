import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardNav from '../components/Dashboard/DashboardNav';
import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';
import DashboardPay from '../components/Dashboard/DashboardPay';
import DashboardOrders from '../components/Dashboard/DashboardOrders';
import DashboardReview from '../components/Dashboard/DashboardReview';
import MakeAdmin from '../components/Dashboard/AdminParts/MakeAdmin';
import AdminRoute from '../components/AdminRoute/AdminRoute';
import { Alert, Snackbar } from '@mui/material';
import AddNewCar from '../components/Dashboard/AdminParts/AddNewCar';

const Icon = styled('i')(({ theme }) => ({
    color: 'inherit', fontSize: '20px'
}));


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


const Dashboard = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [processStatus, setProcessStatus] = React.useState(null);

    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    // change mobile state depending on window width
    function changeMobileState() {
        window.innerWidth < 600 && setIsMobile(true)
        window.innerWidth < 600 && setOpen(false)
    }
    useEffect(changeMobileState, [])
    window.addEventListener('resize', changeMobileState)

    // styled components
    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
            padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0
            }),
        }),
    );

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        padding: '10px 0', zIndex: 10,
        background: '#ff00000f', color: theme.palette.primary.dark,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            marginLeft: isMobile ? 0 : `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));


    // nested routing
    const { path, url } = useRouteMatch();


    const [snackBar, setSnackBar] = React.useState(false);
    const handleSnackBar = () => {
        setSnackBar(true);
    };
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar(false);
    };


    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex', position: 'relative', minHeight: '80vh' }}>
                <CssBaseline />
                <AppBar position="absolute" elevation={1} open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        ><Icon className="fas fa-chevron-right"></Icon>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        }, '& > div': { position: 'absolute', zIndex: 10 }
                    }}
                    variant={isMobile ? "temporary" : "persistent"}
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <DashboardNav url={url} />
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    <Box>
                        <Switch>
                            <Route path={`${path}/pay`}><DashboardPay /></Route>
                            <Route path={`${path}/orders`}>
                                <DashboardOrders setProcessStatus={setProcessStatus} handleSnackBar={handleSnackBar} />
                            </Route>
                            <Route path={`${path}/review/add`}><DashboardReview /></Route>
                            <AdminRoute path={`${path}/make_admin`}>
                                <MakeAdmin setProcessStatus={setProcessStatus} handleSnackBar={handleSnackBar} />
                            </AdminRoute>
                            <AdminRoute path={`${path}/add_car`}>
                                <AddNewCar setProcessStatus={setProcessStatus} handleSnackBar={handleSnackBar} />
                            </AdminRoute>
                        </Switch>
                    </Box>
                </Main>
            </Box>
            {processStatus?.success &&
                <Snackbar open={snackBar} autoHideDuration={4000} onClose={handleSnackBarClose}>
                    <Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
                        {processStatus?.success}
                    </Alert>
                </Snackbar>
            }{processStatus?.error &&
                <Snackbar open={snackBar} autoHideDuration={4000} onClose={handleSnackBarClose}>
                    <Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
                        {processStatus?.error}
                    </Alert>
                </Snackbar>
            }
        </BrowserRouter>
    );
};

export default Dashboard;