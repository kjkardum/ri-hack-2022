import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {Card, Link, Container, Typography, CardContent, Paper, Button, CardHeader, Stack, Grid, CardMedia, Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';
import NativeMap from "../components/NativeMap";
import useAuth from "../hooks/useAuth";
import {loginCheckBackend} from "../endpoints/StatusEndpoints";

// ----------------------------------------------------------------------

const data = [{"code": "#1 PET(E)", "name": "Polyethylene terephthalate", "description": "Polyester   fibers ,  soft drink   bottles ,  food   containers  (also see  plastic bottles )"}, {"code": "#2 PEHD or HDPE", "name": "High-density polyethylene", "description": "Plastic milk containers ,  plastic bags ,  bottle caps ,  trash cans ,  oil   cans ,  plastic lumber , toolboxes, supplement containers"}, {"code": "#3 PVC", "name": "Polyvinyl chloride", "description": "Window frames ,  bottles  for  chemicals ,  flooring ,  plumbing   pipes"}, {"code": "#4 PELD or LDPE", "name": "Low-density polyethylene", "description": "Plastic bags ,  Ziploc bags ,  buckets ,  squeeze bottles ,  plastic   tubes ,  chopping boards"}, {"code": "#5 PP", "name": "Polypropylene", "description": "Flower pots ,  bumpers , car interior trim, industrial  fibers , carry-out  beverage   cups , microwavable food containers, DVD  keep cases"}, {"code": "#6 PS", "name": "Polystyrene", "description": "Toys ,  video cassettes ,  ashtrays , trunks, beverage/food coolers,  beer  cups,  wine  and  champagne   cups , carry-out  food containers ,  Styrofoam"}, {"code": "#7 O (Other)", "name": "All other plastics", "description": "Polycarbonate (PC) ,  polyamide (PA) ,  styrene acrylonitrile (SAN) ,  acrylic plastics/polyacrylonitrile (PAN) ,  bioplastics"}, {"code": "#ABS [ citation needed ]", "name": "Acrylonitrile butadiene styrene", "description": "Monitor/TV cases, coffee makers,  cell phones ,  calculators , most  computer  plastic,  Lego bricks , most  FFF  3D printed parts that are not  bioplastic  such as  PLA"}, {"code": "#PA [ citation needed ]", "name": "Polyamide  ( Nylon )", "description": "Toothbrush bristles, socks, stockings, etc."}, {"code": "#8  Lead [ citation needed ]", "name": "Lead\u2013acid battery", "description": "Car batteries"}, {"code": "#9 Alkaline", "name": "Alkaline battery", "description": "TV Remote  batteries,  flashlight  batteries"}, {"code": "#10 NiCD", "name": "Nickel\u2013cadmium battery", "description": "Older batteries"}, {"code": "#11 NiMH", "name": "Nickel\u2013metal hydride battery", "description": ""}, {"code": "#12 Li", "name": "Lithium battery", "description": "Cell phone  batteries,  computer  batteries,  camera  batteries"}, {"code": "#13 SO(Z)", "name": "Silver-oxide battery", "description": ""}, {"code": "#14 CZ", "name": "Zinc\u2013carbon battery", "description": "Flashlight batteries"}, {"code": "#20 PAP", "name": "Corrugated fiberboard  ( cardboard )", "description": "Cardboard boxes"}, {"code": "#21 PAP", "name": "Non-corrugated fiberboard ( paperboard )", "description": "Cereal and snack boxes"}, {"code": "#22 PAP", "name": "Paper", "description": "Newspaper ,  books ,  magazines ,  wrapping paper ,  wallpaper , paper  bags , paper  straws"}, {"code": "#40 FE", "name": "Steel", "description": "Food cans"}, {"code": "#41 ALU", "name": "Aluminium", "description": "Soft drink cans ,  deodorant  cans, disposable  food containers ,  aluminium foil ,  heat sinks"}, {"code": "#50 FOR", "name": "Wood", "description": "Furniture ,  chopping boards ,  brooms ,  pencils ,  cocktail sticks ,  wooden spoons"}, {"code": "#51 FOR", "name": "Cork", "description": "Bottle stoppers , place mats, construction material"}, {"code": "#60 COT", "name": "Cotton", "description": "Towels ,  t-shirts ,  cotton buds /swabs,  cotton pads"}, {"code": "#61 TEX", "name": "Jute", "description": "Clothing"}, {"code": "#62-69 TEX", "name": "Other  textiles", "description": ""}, {"code": "#70 GL", "name": "Clear Glass", "description": "Food storage jars"}, {"code": "#71 GL", "name": "Green Glass", "description": "Wine bottles"}, {"code": "#72 GL", "name": "Brown Glass", "description": "Beer, light-sensitive products"}, {"code": "#73 GL", "name": "Dark Sort Glass", "description": ""}, {"code": "#74 GL", "name": "Light Sort Glass", "description": ""}, {"code": "#75 GL", "name": "Light Leaded Glass", "description": "Televisions , high-end electronics display glass like in  calculators"}, {"code": "#76 GL", "name": "Leaded Glass", "description": "Older  televisions ,  ash trays , older beverage holders"}, {"code": "#77 GL", "name": "Copper Mixed/Copper Backed Glass", "description": "Electronics ,  LCD  display heads,  clocks ,  watches"}, {"code": "#78 GL", "name": "Silver Mixed/Silver Backed Glass", "description": "Mirrors , formal table settings"}, {"code": "#79 GL", "name": "Gold Mixed/Gold Backed Glass", "description": "Computer glass , formal table settings"}, {"code": "#80 Paper", "name": "Paper and miscellaneous metals", "description": ""}, {"code": "#81 PapPet", "name": "Paper  +  plastic", "description": "Consumer packaging ,  pet food   bags , cold store  grocery  bags,  Icecream  containers,  cardboard cans ,  disposable plates"}, {"code": "#82", "name": "Paper and fibreboard/Aluminium", "description": ""}, {"code": "#83", "name": "Paper  and  fibreboard / Tinplate", "description": ""}, {"code": "#84 C/PAP (or PapAl)", "name": "Paper  and  cardboard / plastic / aluminium", "description": "Liquid storage containers, juice boxes, cardboard cans, cigarette pack liners, gum wrappers, cartridge shells for blanks, fireworks colouring material,  Tetra Brik ."}, {"code": "#85", "name": "Paper  and  fibreboard / Plastic / Aluminium / Tinplate", "description": ""}, {"code": "#87 CSL (Card-Stock Laminate)", "name": "Biodegradable plastic", "description": "Laminating  material,  special occasion cards ,  bookmarks ,  business cards ,  flyers / advertising"}, {"code": "#90", "name": "Plastics / Aluminium", "description": "Plastic toothpaste tubes/some vacuum packed coffee bags"}, {"code": "#91", "name": "Plastic / Tinplate", "description": ""}, {"code": "#92", "name": "Plastic /Miscellaneous  metals", "description": ""}, {"code": "#95", "name": "Glass / Plastic", "description": ""}, {"code": "#96", "name": "Glass / Aluminium", "description": ""}, {"code": "#97", "name": "Glass / Tinplate", "description": ""}, {"code": "#98", "name": "Glass /Miscellaneous  metals", "description": ""}]

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
        alignItems: 'flex-start',
        padding: theme.spacing(7, 5, 0, 7),
    },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));


const BlurredBackgroundImage = styled('div')(({ theme }) => ({
    backgroundImage: "url(/static/covers/cover-otpadnici-02.jpg)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    filter: "blur(0.7px) brightness(0.45)",
    zIndex: -1,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
}));


const TopPage = styled('div')(({ theme }) => ({
    position: "relative",
    height: "70vh",
    width: "100%",
}));


const ChatBlurredBackgroundImage = styled('div')(({ theme }) => ({
    backgroundImage: "url(/static/covers/grass_photo.jpg)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    filter: "blur(0.7px) brightness(0.45)",
    zIndex: -1,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
}));


const ChatPart = styled('div')(({ theme }) => ({
    position: "relative",
    height: "40vh",
    width: "100%",
}));


// ----------------------------------------------------------------------

export default function HomePage() {
    const {user, login, logout} = useAuth();
    const smUp = useResponsive('up', 'sm');

    const mdUp = useResponsive('up', 'md');

    return (
        <Page title="Home">
            <RootStyle>
                <HeaderStyle>
                    <Logo sx={{opacity: 0}}/>

                        <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                            Working for RiCycle? {''}
                            <Link variant="subtitle2" component={RouterLink} to="/login">
                                Login
                            </Link>
                        </Typography>

                </HeaderStyle>
            </RootStyle>

            <TopPage>
                <BlurredBackgroundImage />
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center"
                       spacing={4}
                       sx={{height: "100%"}}>
                    <img src={"/static/icons/ricycler_ime_bijelo.svg"} alt={""} style={{maxWidth: "500px", paddingLeft: "20px", paddingRight: "20px"}}/>
                    <Stack direction="column"
                           justifyContent="center"
                           alignItems="center"
                           spacing={2}>
                        <Typography textAlign={"center"} variant={"h3"} sx={{color: "white"}}>
                            "The best solution for garbage managment system in Rijeka"
                        </Typography>
                        <Typography textAlign={"center"} variant={"h5"} sx={{color: "white"}}>
                            Made by team haha FER
                        </Typography>
                        <RouterLink to={"/user_map"} style={{ textDecoration: 'none' }}>
                            <Button variant={"contained"}>Check out our map</Button>
                        </RouterLink>
                    </Stack>
                </Stack>
            </TopPage>

            <Typography textAlign={"center"} variant={"h2"} sx={{color: "#1c6e46", marginTop: "45px", marginBottom: "25px"}}>
                Our Mission
            </Typography>

            <Grid container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                <Grid item lg={3} md={3} sm={7} xs={11}>
                    <Card sx={{borderRadius: 0, boxShadow: 0}}>
                        <CardMedia
                            sx={{maxHeight: "180px", margin: "auto", width: "auto"}}
                            component="img"
                            image="/static/icons/ikonica_covjek.svg"
                            alt=""
                        />
                        <CardContent>
                            <Typography textAlign={"center"} gutterBottom variant="h5" component="div">
                                Accessibility
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Our algorithms ensure that everyone can recycle without any hastles.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item lg={3} md={3} sm={7} xs={11}>
                    <Card sx={{borderRadius: 0, boxShadow: 0}}>
                        <CardMedia
                            sx={{maxHeight: "180px", margin: "auto", width: "auto"}}
                            component="img"
                            image="/static/icons/ikonica_knjiga.svg"
                            alt=""
                        />
                        <CardContent>
                            <Typography textAlign={"center"} gutterBottom variant="h5" component="div">
                                Education
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Our platform gives information about recycling and where to recycle for free.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item lg={3} md={3} sm={7} xs={11}>
                    <Card sx={{borderRadius: 0, boxShadow: 0}}>
                        <CardMedia
                            sx={{maxHeight: "180px", margin: "auto", width: "auto"}}
                            component="img"
                            image="/static/icons/ikonica_ruke_zemlja.svg"
                            alt=""
                        />
                        <CardContent>
                            <Typography textAlign={"center"} gutterBottom variant="h5" component="div">
                                Sustainibility
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                We at RiCycler believe that we should produce less waste and we think that recycling is very important for reducing the ammount of waste.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <ChatPart style={{marginTop: "20px"}}>
                <ChatBlurredBackgroundImage />
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center"
                       spacing={2}
                       sx={{height: "100%"}}>
                    <Typography variant={"h2"} sx={{color: "white"}}>24/7 Chat Bot</Typography>
                    <Typography variant={"h5"} sx={{color: "white"}}>Check out our chat bot by clicking on the floating icon on the bottom right of the screen.</Typography>
                </Stack>
            </ChatPart>

            <Typography textAlign={"center"} variant={"h2"} sx={{color: "#1c6e46", marginTop: "45px", marginBottom: "30px"}}>
                Recycling codes table
            </Typography>

            <Container>
                <TableContainer component={Paper}>
                    <Table aria-label="table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Code</TableCell>
                                <TableCell align="left">Description</TableCell>
                                <TableCell align="left">Examples</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={row.code}
                                >
                                    <TableCell align="left" component="th" scope="row">
                                        {row.code}
                                    </TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

        </Page>
    );
}
