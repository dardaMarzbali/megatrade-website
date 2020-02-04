/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import React from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import SupportLive from './components/SupportLive'

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	}
}))

const Support = () => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Grid
				item
				lg={12}
				xl={12}
				md={12}
				xs={12}>
				<SupportLive
				//socket={socket}
				//isPaid={isPaid}
				//profile={profileState}
				//chats={groupChatHistoryState}
				/>
			</Grid>
		</div>
	)
}

export default Support