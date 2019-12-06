import * as React from 'react'
import { Button } from '@material-ui/core'

const SimpleButton = (props: {onClickLogMsg: () => void}): JSX.Element => {
    return <Button onClick={props.onClickLogMsg}>Get Symptoms</Button>
}

export default SimpleButton
