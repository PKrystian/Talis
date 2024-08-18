const LoginModal = ({ buttonClass, buttonText, ButtonTag, setUser, setUserState }) => {
  return (
    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content backplate">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">Login</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="register-form" onSubmit={ e => e.preventDefault() } noValidate>
              <div className="form-group mt-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" className="form-control" type="email" placeholder="example@mail.com" required />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" className="form-control" type="password" placeholder="your password" required />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal
