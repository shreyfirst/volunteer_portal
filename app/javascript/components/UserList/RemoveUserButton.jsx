import React from 'react'

import RemoveIcon from '@zendeskgarden/svg-icons/src/16/trash-stroke.svg'
import { Icon, IconButton } from '@zendeskgarden/react-buttons'

const RemoveUserButton = ({ user, confirm }) => (
  <IconButton aria-label={`Remove volunteer ${user.name} from this event`} onClick={confirm}>
    <Icon>
      <RemoveIcon />
    </Icon>
  </IconButton>
)

export default RemoveUserButton
