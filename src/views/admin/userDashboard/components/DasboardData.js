/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import clsx from 'clsx'
import Validate from 'validate.js'
import PropTypes from 'prop-types'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/styles'
import React, { useState, useEffect } from 'react'
import { Card, Grid, Button, Divider, TextField, CardHeader, CardActions, CardContent } from '@material-ui/core'

import { AdminApi } from '../../../../config/Api'

const adminApi = new AdminApi()

const schema = {
    tradeBudget: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    totalUsers: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    totalPips: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    totalProfits: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    labels: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 526
        }
    },
    data: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 526
        }
    },
    backgroundColor: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 526
        }
    }
}

const useStyles = makeStyles(theme => ({
    root: {},
    uploadButton: {
        marginRight: theme.spacing(2)
    }
}))

const NewUserDashboard = props => {
    const { className, ...rest } = props

    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    const adminId = localStorage.getItem('adminId')

    const [userDashboardState, setUserDashboardState] = useState({
        errors: {},
        values: {
            totalPips: '',
            totalUsers: '',
            tradeBudget: '',
            totalProfits: '',
            tradeFocus: {
                data: '',
                labels: '',
                backgroundColor: ''
            },
        },
        touched: {},
        isValid: false,
        isChanged: false
    })

    useEffect(() => { fetchUserDashboard() }, [])

    useEffect(() => {
        const errors = Validate(userDashboardState.values, schema)

        setUserDashboardState(userDashboardState => ({
            ...userDashboardState,
            isValid: errors ? false : true,
            errors: errors || {}
        }))
    }, [userDashboardState.values])

    const onChange = event => {
        event.persist()

        setUserDashboardState(userDashboardState => ({
            ...userDashboardState,
            values: {
                ...userDashboardState.values,
                [event.target.name]: event.target.value
            },
            touched: {
                ...userDashboardState.touched,
                [event.target.name]: true
            },
            isChanged: true
        }))
    }

    const onChangeTradeFocus = event => {
        event.persist()

        setUserDashboardState(userDashboardState => ({
            ...userDashboardState,
            values: {
                ...userDashboardState.values,
                tradeFocus: {
                    ...userDashboardState.values.tradeFocus,
                    [event.target.name]: event.target.value
                }
            },
            touched: {
                ...userDashboardState.touched,
                tradeFocus: {
                    ...userDashboardState.touched.tradeFocus,
                    [event.target.name]: true
                }
            },
            isChanged: true
        }))
    }

    const fetchUserDashboard = async () => {
        const fetchUserDashboardResult = await adminApi.fetchUserDashboard({ adminId })
        if (fetchUserDashboardResult.error)
            return enqueueSnackbar(fetchUserDashboardResult.message, { variant: 'error' })

        setUserDashboardState(userDashboardState => ({
            ...userDashboardState,
            values: {
                ...userDashboardState.values,
                ...fetchUserDashboardResult.data,
                tradeFocus: {
                    data: fetchUserDashboardResult.data.tradeFocus.data.join(', '),
                    labels: fetchUserDashboardResult.data.tradeFocus.labels.join(', '),
                    backgroundColor: fetchUserDashboardResult.data.tradeFocus.backgroundColor.join(', ')
                }
            }
        }))
    }

    const onCreateUserDashboard = async () => {
        console.log('=====================');

        const createResult = await adminApi.createUserDashboard({
            adminId,
            totalPips: userDashboardState.values.totalPips,
            totalUsers: userDashboardState.values.totalUsers,
            tradeBudget: userDashboardState.values.tradeBudget,
            totalProfits: userDashboardState.values.totalProfits,
            tradeFocus: {
                data: userDashboardState.values.tradeFocus.data.split(', '),
                labels: userDashboardState.values.tradeFocus.labels.split(', '),
                backgroundColor: userDashboardState.values.tradeFocus.backgroundColor.split(', ')
            }
        })

        if (createResult.error)
            return enqueueSnackbar(createResult.message, { variant: 'error' })

        enqueueSnackbar(createResult.message, { variant: 'success' })
        window.location.reload()
    }

    const hasError = field =>
        userDashboardState.touched[field] && userDashboardState.errors[field] ? true : false

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}>
            <form
                noValidate
                autoComplete='off'>
                <CardHeader
                    title='User Dashboard - Stats'
                    subheader='You can edit what users dashboard stats display here' />

                <Divider />

                <CardContent>
                    <Grid
                        container
                        spacing={3}>
                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                margin='dense'
                                name='totalPips'
                                label='Total Pips'
                                variant='outlined'
                                onChange={onChange}
                                error={hasError('totalPips')}
                                value={userDashboardState.values.totalPips}
                                helperText={
                                    hasError('totalPips') ? userDashboardState.errors.totalPips[0] : null
                                } />
                        </Grid>

                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                margin='dense'
                                name='totalUsers'
                                variant='outlined'
                                label='Total Users'
                                onChange={onChange}
                                error={hasError('totalUsers')}
                                value={userDashboardState.values.totalUsers}
                                helperText={
                                    hasError('totalUsers') ? userDashboardState.errors.totalUsers[0] : null
                                } />
                        </Grid>

                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                margin='dense'
                                name='tradeBudget'
                                variant='outlined'
                                onChange={onChange}
                                label='Trade Budget'
                                error={hasError('tradeBudget')}
                                InputProps={{ startAdornment: '$' }}
                                value={userDashboardState.values.tradeBudget}
                                helperText={
                                    hasError('tradeBudget') ? userDashboardState.errors.tradeBudget[0] : null
                                } />
                        </Grid>

                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                margin='dense'
                                variant='outlined'
                                name='totalProfits'
                                onChange={onChange}
                                label='Total Profits'
                                error={hasError('totalProfits')}
                                InputProps={{ startAdornment: '$' }}
                                value={userDashboardState.values.totalProfits}
                                helperText={
                                    hasError('totalProfits') ? userDashboardState.errors.totalProfits[0] : null
                                } />
                        </Grid>
                    </Grid>
                </CardContent>

                <CardHeader
                    title='User Dashboard - Trade Focus'
                    subheader='You can edit what users dashboard trade focus pie chat display here' />

                <Divider />

                <CardContent>
                    <Grid
                        container
                        spacing={3}>
                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                name='labels'
                                label='Labels'
                                margin='dense'
                                variant='outlined'
                                error={hasError('labels')}
                                onChange={onChangeTradeFocus}
                                value={userDashboardState.values.tradeFocus.labels}
                                helperText={
                                    hasError('labels') ? userDashboardState.errors.labels[0] : 'Enter the labels to be used on the pie chart seperated by a comma. i.e. USD/JPY, EUR/JPY, Wall Street DJI'
                                } />
                        </Grid>

                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                name='data'
                                label='Data'
                                margin='dense'
                                variant='outlined'
                                error={hasError('data')}
                                onChange={onChangeTradeFocus}
                                value={userDashboardState.values.tradeFocus.data}
                                helperText={
                                    hasError('data') ? userDashboardState.errors.data[0] : 'Enter the percentage you want for each label seperated by a comma. i.e. 63, 15, 22'
                                } />
                        </Grid>

                        <Grid
                            item
                            md={6}
                            xs={12}>
                            <TextField
                                required
                                fullWidth
                                margin='dense'
                                variant='outlined'
                                name='backgroundColor'
                                label='Background Color'
                                onChange={onChangeTradeFocus}
                                error={hasError('backgroundColor')}
                                value={userDashboardState.values.tradeFocus.backgroundColor}
                                helperText={
                                    hasError('backgroundColor') ? userDashboardState.errors.backgroundColor[0] : 'Enter the color for each label seperated by a comma. i.e. blue, red, orange'
                                } />
                        </Grid>
                    </Grid>
                </CardContent>

                <Divider />

                <CardActions>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={onCreateUserDashboard}
                        disabled={!userDashboardState.isChanged || hasError('totalProfits') || userDashboardState.values.totalProfits.length <= 0 || hasError('tradeBudget') || userDashboardState.values.tradeBudget.length <= 0 || hasError('totalUsers') || userDashboardState.values.totalUsers.length <= 0 || hasError('totalPips') || userDashboardState.values.totalPips.length <= 0 || hasError('labels') || userDashboardState.values.tradeFocus.labels.length <= 0 || hasError('data') || userDashboardState.values.tradeFocus.data.length <= 0 || hasError('backgroundColor') || userDashboardState.values.tradeFocus.backgroundColor.length <= 0}>
                        Create User Dashboard Data
          			</Button>
                </CardActions>
            </form>
        </Card>
    )
}

NewUserDashboard.propTypes = {
    className: PropTypes.string
}

export default NewUserDashboard