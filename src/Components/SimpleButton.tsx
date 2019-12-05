import * as React from 'react'
import requests from 'SymptomCheckerApi/ApiUtilities/requests'
import { Button } from '@material-ui/core'

// run the localhost with chrome with this command to bypass cors
// google-chrome --disable-web-security --user-data-dir="~/.google-chrome-root"
const SimpleButton = (props: {onClickLogMsg: () => void}): JSX.Element => {
    const uri = "https://sandbox-healthservice.priaid.ch/issues/15/info?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjkxOTgwNTkzNUBxcS5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjYxNTIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTktMTItMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU3NTUzODYxOCwibmJmIjoxNTc1NTMxNDE4fQ.-ups7ZlBVUi0L4-p3k02uDxXZspcS_jxP6h20v-KIjg&format=json&language=en-gb" // issue info
    const apiPromise = requests(uri)
    apiPromise.then(res => console.log(res))
    return <Button onClick={props.onClickLogMsg}>Get Info</Button>
}

export default SimpleButton
