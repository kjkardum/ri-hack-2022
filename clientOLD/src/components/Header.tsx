import {Stack, Typography} from "@mui/material";

const Header = () => {
    return (
        <Stack
            direction={"row"}
            justifyContent={"space-between"}
        >
            <Stack>
                <Typography variant="h1">
                    App name
                </Typography>;

            </Stack>
        </Stack>
    );
}

export default Header;