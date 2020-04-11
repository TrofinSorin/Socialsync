const SnackbarService = {
  message: '',
  messageType: '',
  setMessage(message, type) {
    if (!message) {
      return;
    }

    this.message = message;
  }
};

export default SnackbarService;
