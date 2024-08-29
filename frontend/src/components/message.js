import { Typography } from "@mui/material";

function Message ({sender, message, time}) {
    return (
        <Typography component='div'>
            {/* <Typography variant="body2">{sender}</Typography>
            <Typography variant="body1">{message}</Typography>
            <Typography variant="body1">{time}</Typography> */}
        </Typography>
    );
}

export default Message;