const ResetPassword = () => {
  return (
    <div>
      <h1>Reset Password Page</h1>
      <form>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ResetPassword;