/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { useSnackbar } from 'notistack'
import useSocket from 'use-socket.io-client'
import { makeStyles } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import { Grid, Dialog, CircularProgress, DialogContent, Hidden } from '@material-ui/core'

import { AdminApi } from 'config/Api'
import Constants from 'config/Constants'
import GroupChatLive from './components/GroupChatLive'
import GroupChatMembers from './components/GroupChatMembers'

const adminApi = new AdminApi()

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: 20,
		textAlign: 'center'
	},
	contentInner: {
		marginTop: 20
	},
	image: {
		width: 560,
		marginTop: 50,
		maxWidth: '100%',
		display: 'inline-block'
	}
}))

const GroupChat = () => {
	const classes = useStyles()
	const { enqueueSnackbar } = useSnackbar()

	const adminId = localStorage.getItem('adminId')

	const [isLoading, setIsLoading] = useState(true)
	const [socket] = useSocket(`${Constants.SERVER_URL}/chat-group`, {
		autoConnect: false
	})
	const [availableUsersState, setAvailableUsersState] = useState([])
	const [groupChatHistoryState, setGroupChatHistoryState] = useState([])
	const [profileState, setProfileState] = useState({
		avatar: '',
		fullName: ''
	})

	useEffect(() => { fetchProfileDetails() }, [])

	const fetchProfileDetails = async () => {
		const fetchAccountResult = await adminApi.fetchAccount({ adminId })

		if (fetchAccountResult.error) {
			setIsLoading(false)
			return enqueueSnackbar(fetchAccountResult.message, { variant: 'error' })
		}

		setProfileState(profileState => ({
			...profileState,
			avatar: fetchAccountResult.data.avatar || '',
			fullName: fetchAccountResult.data.firstName + ' ' + fetchAccountResult.data.lastName || ''
		}))

		setIsLoading(false)
	}

	useEffect(() => {
		if (!isLoading) {
			socket.connect()

			socket.emit('userJoined', {
				id: adminId,
				isAdmin: true,
				avatar: profileState.avatar,
				fullName: profileState.fullName
			})

			socket.on('availableUsers', data => setAvailableUsersState(data))

			socket.on('chatHistory', data => setGroupChatHistoryState(data))

			socket.on('message', data => setGroupChatHistoryState(groupChatHistoryState => ([...groupChatHistoryState, data])))
		}
	}, [isLoading])

	if (isLoading)
		return (
			<Dialog open={isLoading}>
				<DialogContent>
					<CircularProgress />
				</DialogContent>
			</Dialog>
		)

	return (
		<div className={classes.root}>
			<Grid
				container
				spacing={4}
				justify='center'>
				<Hidden mdDown>
					<Grid
						item
						lg={3}
						xl={3}
						md={12}
						xs={12}>
						<GroupChatMembers
							profile={profileState}
							users={availableUsersState} />
					</Grid>
				</Hidden>

				<Grid
					item
					lg={9}
					xl={9}
					md={12}
					xs={12}>
					<GroupChatLive
						socket={socket}
						profile={profileState}
						chats={groupChatHistoryState} />
				</Grid>
			</Grid>
		</div>
	)
}

export default GroupChat