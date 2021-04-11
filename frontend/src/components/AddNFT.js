import React, { useState }  from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Grid from '@material-ui/core/Grid';
// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'


const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const useStyles = makeStyles({
  root: { // card
    maxWidth: 200,
    justifyContent: 'center',
    flexGrow: 1,
    width: 160
  },
  media: {
    height: 160,
  }
});

export function AddNFT({ NFTs, transferTokens, NFTs_NeverFightTwice, memes }) {
  const classes = useStyles();
  const [seed, setSeed] = useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e, tokenId, nftContractAddr) => {
    e.preventDefault();
    console.log(seed);
    console.log(tokenId);
    console.log(nftContractAddr);
    transferTokens(nftContractAddr, tokenId, seed)
    handleClose();
  };

  return <Grid container spacing={3}>
  <Grid item xs={6}>
    <Typography gutterBottom variant="h4" align="center">
    🚀 Your NFTs 😆💪
    </Typography>
    <Carousel 
      responsive={responsive} 
      autoPlay={true}>{

        NFTs.map((NFT, i) => {     
        return (
        <div className="col-2" key={i}>
          <Card className={classes.root} style={{
            // backgroundColor: '#fbfbf8' // paper color
          }}>
          <CardActionArea>
          <Tooltip title={"TokenId: "+NFT.tokenId.toString()}>
          {NFT.thumbnail ? (NFT.thumbnail.slice(-3) === 'mp4'?  
            <CardMedia
              component='video'
              className={classes.media}
              image={NFT.thumbnail}
              autoPlay
              loop
            />:
            <CardMedia
              className={classes.media}
              image={NFT.thumbnail}
            />): 
            (<CardMedia
              className={classes.media}
              // image={"http://placekitten.com/200/200?image=" + (i%16+1).toString()}
              image={memes[i%50].url}
            />)}
            </Tooltip>

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
              {NFT.nftContractName} 
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              {NFT.name}
              </Typography>
              
            </CardContent>
            <CardActions classes={{root: classes.root}}>
            <Button size="small" color="primary" target="_blank" href={NFT.openseaLink}>
              View on Opensea
            </Button>
            </CardActions>
          </CardActionArea>
        </Card>
        <Box p={2}>
        <Button variant="contained" color="secondary" onClick={handleClickOpen} style={{
            transform: 'translate(50%, 0%)',
            backgroundColor: '#FFD700',
            color: 'black',
            fontWeight: 'bold'
        }}>
          Bet!
          </Button>
          <form onSubmit={handleSubmit}>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Choose Your Random Seed to Bet!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Input a random seed below and click bet!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id={i.toString()}
                label="Random Seed"
                fullWidth
                onChange={e => setSeed(e.target.value)}
              />
            </DialogContent>
            <DialogActions onSubmit={handleSubmit}>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" onClick={ (e) => handleSubmit(e, NFT.tokenId, NFT.nftContractAddr)}>
                Bet!
              </Button>
            </DialogActions>
          </Dialog>
          </form>
        </Box>
        </div>)})}
    </Carousel></Grid>





    <Grid item xs={6}>
    <Typography gutterBottom variant="h4" component="h2" align="center">
      🚀 Potential NFTs to Win 😎😏
    </Typography>
    <Carousel 
      responsive={responsive} 
      autoPlay={true}>{

        NFTs_NeverFightTwice.map((NFT, i) => {     
        return (
        <div className="col-2" key={i}>
          <Card className={classes.root} style={{
            // backgroundColor: '#fbfbf8' // paper color
          }}>
          <CardActionArea>
          <Tooltip title={"TokenId: "+NFT.tokenId.toString()}>
          {NFT.thumbnail ? (NFT.thumbnail.slice(-3) === 'mp4'?  
            <CardMedia
              component='video'
              className={classes.media}
              image={NFT.thumbnail}
              autoPlay
              loop
            />:
            <CardMedia
              className={classes.media}
              image={NFT.thumbnail}
            />): 
            (<CardMedia
              className={classes.media}
              // image={"http://placekitten.com/200/200?image=" + (i%16+1).toString()}
              image={memes[50-i%50].url}
              />)}
            </Tooltip>

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
              {NFT.nftContractName} 
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              {NFT.name}
              </Typography>
              
            </CardContent>
            <CardActions classes={{root: classes.root}}>
            <Button size="small" color="primary" target="_blank" href={NFT.openseaLink}>
              View on Opensea
            </Button>
            </CardActions>
          </CardActionArea>
        </Card>
        <Box p={2}>
        <Button variant="contained" color="secondary" style={{
            transform: 'translate(50%, 0%)',
            backgroundColor: 'transparent',
            color: 'transparent',
            fontWeight: 'bold',
            opacity: '0',
            pointerEvents: 'none'
        }}>
          Bet!
          </Button>
          
        </Box>
        </div>)})}
    </Carousel>
    </Grid>
    
    </Grid>
}
