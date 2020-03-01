import * as React from "react"
import { Grid } from "@material-ui/core"
import "./Header.css"

interface IProps {
  text: string
}

const Header = (props: IProps) => (
  <Grid container={true} alignItems="center" justify="center">
    <Grid item={true} xs={12} sm={12} md={12}>
      <h2 className="header">{props.text}</h2>
    </Grid>
  </Grid>
)

export default Header
