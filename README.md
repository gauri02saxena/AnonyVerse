# AnonyVerse: A Secure Secrets Sharing Platform

The Secrets App is a web application that allows users to share and discover secrets anonymously. To maintain the privacy of the secrets and ensure a seamless user experience, the app employs Google OAuth for user authentication and authorization. This project serves as a practical implementation of OAuth using the Passport library.

## Features

1. **User Authentication:** Users can log in using their Google accounts through OAuth 2.0. This ensures a secure and streamlined authentication process.

2. **Secret Sharing:** Authenticated users can share their secrets anonymously. Secrets are stored in a safe manner to maintain user privacy.

3. **User-Specific Secrets:** Each user can only view and manage their own secrets after logging in.

4. **Password Security:** User passwords are securely hashed and stored.

## Technologies Used

The Secrets App utilizes the following technologies and libraries:

- Node.js
- Express.js
- Passport.js
- Passport-Google-OAuth20
- MongoDB
- Mongoose
- Express Session
- EJS (Embedded JavaScript)
- Dotenv

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.

2. Click on the "Login with Google" button to authenticate using your Google account.

3. Once authenticated, you'll be able to view and submit secrets.

4. To add a new secret, click on the "Submit a Secret" button and enter your secret in the provided field.

5. Your secret will be saved anonymously, and you can view it on the main page.


## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for using the Secrets App! Happy secret-sharing!
