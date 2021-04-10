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

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    justifyContent: 'center'
  },
  media: {
    height: 140,
  }
});

export function AddNFT({ NFTs, transferTokens }) {
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

  return <div className="row justify-content-md-center">{
    NFTs.map((NFT, i) => {     
    return (
    <div className="col-2" key={i}>
      <Card className={classes.root}>
      <CardActionArea>
      {NFT.thumbnail.slice(-3) === 'mp4'?  
        <CardMedia
          component='video'
          className={classes.media}
          image={NFT.thumbnail}
          title="Contemplative Reptile"
          autoPlay
          loop
        />:
        <CardMedia
          className={classes.media}
          image={NFT.thumbnail}
          title="Contemplative Reptile"
        />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {NFT.nftContractName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          {NFT.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" target="_blank" href={NFT.openseaLink}>
          View on Opensea
        </Button>
      </CardActions>
    </Card>
    <Box m={2}>
    <div className="row justify-content-center" >  
    <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
            id="seed"
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
    </div>
    </Box>
    </div>)})}
    </div>
}
