# Bizlink-v2-backend

Bizlink is a full stack web app that provides a platform that brings businesses and individuals together.
Users can post their business on Bizlink and get feedback in form of reviews and votes from other users. [The front-end repo is here](https://github.com/tope-olajide/Bizlink-v2-frontend)

## Hosted Application

**Front-end** https://bizlink.now.sh/
**Back-end** https://bislink.herokuapp.com/

## Installation

1. Install [`node`](https://nodejs.org/en/download/), version 12 or greater

3) Clone this repo and cd into it

   ```
   git clone https://github.com/tope-olajide/Bizlink-v2-backend.git
   cd Bizlink-v2-backend
   ```

4. Install all dependencies

   ```
   npm install
   ```

5. Configure Postgres

   ```
   configure your database settings for development and test in
   `./database/config/config.json` using .env.example file template
   ```

6. Run database migrations

   ```
   $ sequelize db:migrate
   ```

6) Start the app by running:

   ```
   npm run dev
   ```

## API Routes

<table>
<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>
<tr><td>POST</td> <td>api/user/signin</td> <td>Sign in a user</td></tr>
<tr><td>POST</td> <td>api/user/signup</td> <td>Create a new user</td></tr>
<tr><td>PUT</td> <td>api/user/change-password</td> <td>Change User's password</td></tr>
<tr><td>PUT</td> <td>api/user/profile</td> <td>Update user's profile</td></tr>
<tr><td>GET</td> <td>api/user/profile</td> <td>Fetch user's profile</td></tr>
<tr><td>GET</td> <td>api/user/businesses</td> <td>Fetch all businesses that belongs to a user</td></tr>
<tr><td>POST</td> <td>api/user/favourite/:businessId</td> <td>Add business to user's favourite</td></tr>
<tr><td>DELETE</td> <td>api/favourite/:businessId</td> <td>Remove Business from user's favouite</td></tr>
<tr><td>GET</td> <td>api/user/followee</td> <td>Fetch all the followees of a user</td></tr>
<tr><td>GET</td> <td>api/user/follower</td> <td>Fetch all the followers of a user</td></tr>
<tr><td>GET</td> <td>api/user/favourites</td> <td>Fetch all user's favourite business</td></tr>
<tr><td>POST</td> <td>api/user/follow/:userId</td> <td>Follow a user</td></tr>
<tr><td>DELETE</td> <td>api/user/unfollow/:userId</td> <td>Unollow a user</td></tr>
<tr><td>GET</td> <td>api/user/notifications/all</td> <td>Fetch all user's notifications</td></tr>
<tr><td>GET</td> <td>api/user/notifications/seen</td> <td>Fetch all read notification</td></tr>
<tr><td>GET</td> <td>api/user/notifications</td> <td>Fetch all unread notification</td></tr>
<tr><td>GET</td> <td>api/user/notifications/:notificationId</td> <td>View user's notification</td></tr>
<tr><td>DELETE</td> <td>api/notifications/:notificationId</td> <td>Delete a notification</td></tr>
<tr><td>PUT</td> <td>api/user/notifications</td> <td>Marks all Unread notifications as Read</td></tr>
<tr><td>GET</td> <td>api/user/notifications/new-notifications-count</td> <td>Count all Unread Notification</td></tr>
<tr><td>GET</td> <td>api/user/profile</td> <td>Fetch user's profile</td></tr>
<tr><td>POST</td> <td>api/business/</td> <td>Create a new business</td></tr>
<tr><td>GET</td> <td>api/business/</td> <td>Fetch All Businesses</td></tr>
<tr><td>GET</td> <td>api/business/search</td> <td>Search For a business</td></tr>
<tr><td>Get</td> <td>api/business/:businessId</td> <td>Fetch a business Details</td></tr>
<tr><td>PUT</td> <td>api/business/:businessId</td> <td>Modify a Business</td></tr>
<tr><td>DELETE</td> <td>api/business/:businessId</td> <td>Delete a business</td></tr>
<tr><td>POST</td> <td>api/business/:businessId/upvotes</td> <td>Upvote a business</td></tr>
<tr><td>GET</td> <td>api/business/:businessId/upvotes</td> <td>Fetch all upvoted Business</td></tr>
<tr><td>POST</td> <td>api/business/:businessId/downvotes</td> <td>Downvotes a business</td></tr>
<tr><td>GET</td> <td>api/business/:businessId/downvotes</td> <td>Fetches all downvoted business</td></tr>
<tr><td>POST</td> <td>api/business/:businessId/reviews</td> <td>Review a business</td></tr>
<tr><td>GET</td> <td>api/business/:businessId/reviews</td> <td>Fetches all business review</td></tr>
<tr><td>POST</td> <td>api/business/gallery</td> <td>Upload Business image</td></tr>
<tr><td>GET</td> <td>api/business/:businessId/gallery</td> <td>Fetch Business gallery</td></tr>
<tr><td>DELETE</td> <td>api/business/:businessImageId/gallery</td> <td>Delete a business image</td></tr>
<tr><td>POST</td> <td>api/business/:businessId/gallery</td> <td>Change default besiness image</td></tr>
</table>

## Features
1. Create an account with fulname, username, email and password.
2. Sign in with username or email and password
3. Create a Business
4. Modify a business
5. View business details
6. Search for a business
7. Post reviews on businesses
8. Add business and remove business from favourite
9. Upvote or downvote business
10. View/edit user profile
11. Follow another user
12. User get in app notifications when:
- they Registered for the first time
- their business get upvoted or downvoted.
- their businesses get reviewed.
- they are followed or unfollowed by another user.
- their business get added to another user's favourite.

## Built With

* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built on chrome V8 engine that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJs](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [Sequelize](http://docs.sequelizejs.com/) - An ORM for Node.js that supports the dialects of PostgreSQL and features solid transaction support an relations.
* [Postgres](https://www.postgresql.org/) - A powerful, open source object-relational database system.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

If you are interested in contributing to development of this project, follow the instructions below to contribute.

- Fork the repository

- Make your change

- Commit your change to your forked repository

- Provide a detailed commit description

- Raise a pull request against the master branch

#### Can I clone this application for personal use?

    Yes!. This application is licensed under MIT, and it's open for
    everybody

## Author

- **Temitope David Olajide** - Fullstack Developer.

