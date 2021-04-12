import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from "@material-ui/core/styles";
import ReactTooltip from 'react-tooltip';

export function Popup({_open, _title, _content}) {
  const [open, setOpen] = React.useState(true);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

  const handleClose = () => {
    setOpen(false);
  };

  const DialogActions = withStyles(theme => ({
    root: {
      margin: theme.spacing(2),
      padding: 0
    }
  }))(MuiDialogActions);

  const DialogTitle = withStyles(theme => ({
    root: {
      margin: theme.spacing(3),
      padding: 0
    }
  }))(MuiDialogTitle);

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={_open && open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="id">
         <Box display="flex" alignItems="center">
                <Box flexGrow={1} ><h3>{_title}</h3></Box>
                <Box>
                    <IconButton onClick={handleClose}>
                          <CloseIcon />
                    </IconButton>
                </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {_content.NFTcontract_win? 
                <div>
                  {`The random number was`} <b data-tip={_content.randomNumber}>{_content.randomNumber.substring(0,6) + '...'}</b> {`. The NFT you betted was from contract ${_content.NFTcontract_original} with token ID`} <b data-tip={_content.NFTid_original}>{_content.NFTid_original.substring(0,6) + '...'}</b> {`.`}
            {`\nThe NFT you won was from contract ${_content.NFTcontract_win} with token ID `} <b data-tip={_content.NFTid_win}>{_content.NFTid_win.substring(0,6) + '...'}</b> {`.`}
            {"\n(hover to view the full values)"}
                </div>: 
            
                <div>
                    {`The random number was`} <b data-tip={_content.randomNumber}>{_content.randomNumber.substring(0,6) + '...'}</b> {`. The NFT you betted was from contract ${_content.NFTcontract_original} with token ID`} <b data-tip={_content.NFTid_original}>{_content.NFTid_original.substring(0,6) + '...'}</b> {`.`}
            {"\n(hover to view the full values)"}
                </div>
            }
            
            <ReactTooltip />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <input className="btn btn-primary" value="Try Again!" onClick={handleClose} readOnly/>
          {/* <Button variant='contained' onClick={handleClose} color="primary" autoFocus>
            Try Again!
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}