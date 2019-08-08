import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default class DialogContaincer extends Component {
    state ={
        productInEdit: this.props.dataItem || null
    }
    render() {
        return (

<Dialog title={"Delete Data"} onClose={this.props.cancel}>
                    <p style={{ margin: "25px", textAlign: "center" }}>This action cannot be undone.</p>
                    <DialogActionsBar>
            <button
                className="k-button"
                onClick={this.props.cancel}
            >
                Cancel
                            </button>
            <button
                className="k-button k-primary"
                onClick={this.props.delete}
            >
                Delete
                            </button>
            </DialogActionsBar>
        </Dialog>
        );
    }
  }
  