# MeetNow
(meetnow description/pitch here)

## Dependencies

**Express**
  : This package is what runs the server. It provides a very streamlined way of adding middleware to an HTTP server in Node.

**Body-Parser**
  : Allows easy reading of request bodies by automatically parsing JSON and turning URL Encoded information into a body object.

**Mongoose**
  : Integrates Node with MongoDB very well.

**JSONWebToken**
  : Used for Bearer Authentication and keeps a user's session tied to a private key.

**BCrypt**
  : Encrypts all the passwords for people's user profiles. Increases security by not storing the passwords in raw text format.

**Mongoose GeoJSON Schema**
  : Add-on to Mongoose Schemas that allows for easy storing and querying of geographical location data.

**HTTP Errors**
  : Creates errors for the error handling middleware to handle with return codes and descriptions.

**SendMail**
  : Sends emails with an HTML formatted body. Used for two factor authentication.

## API Reference

### Authentication
To register a new user, send a POST request to the /user endpoint with the relevant data in JSON format.

<code>POST /user</code>

Example JSON using only the required fields:
``` javascript
{
  "username": "TestUser",
  "password": "password123",
  "email": "testing@test.com",
  "radius": 5
}
```
Other optional fields include gender, age, currentLocation, and interests.


Logging in can be done by sending a GET request with a Basic Authentication header that uses the User's email as the username.

<code>GET /login</code>

If the login credentials are incorrect, the server will send over this object:

``` javascript
Error 403: Invalid credentials.
```

Upon successful login, the object will contain an auth token along with the date that it will expire like so:

``` javascript
{
  token: TOKEN,
  expiresIn: Date.now() + (TOKEN_EXPIRY_TIME * 1000)
}
```

This token should be used in any authenticated endpoints and sent in a Bearer Authentication header.

###Two Factor Authentication
There is support for two-factor authentication on the server as well which can be enabled on a user through either a PUT or
on user creation by setting the "twoFactorEnabled" field to true.

If this field is true on the user, it adds an extra step to the /login route. The initial request to login (with correct credentials) will send you an email
that contains a 5 digit code that lasts for 20 minutes.

This 5 digit code should be sent with your next login request as the value for a "TwoFactorKey" header.
If the code is correct, then it returns the same response as described above with your token and expiry time.

You won't have to use two factor authentication again for as long as the key lasts. This means every new device will required
your two factor code to login with.

### User Endpoints (Authenticated)
You can use these endpoints to modify/retrieve User, Activity, Interest, or Category data so long as you have the permissions.

To get data about your user profile, send a GET request to /user with using a Bearer Auth header.

<code>GET /user</code>

The server will respond with all of your account's information except your hashed password.

For details on a different user, send a GET request with their user id in the path like this:

<code>GET /user/userId</code>

The server will respond with a user object if the object exists, or an error message if it does not exist.

<code>GET /user/search</code>

This endpoint allows you to search for nearby users with similar interests in the querystring.

Example request:
<code>/user/search?lat=50.293&lng=120.55&radius=4&interest=f893js2hd28s9k9fk2</code>
where lat/lng are the lattitude and longitude, radius is the search radius in miles, and the interest is an optional field that represents an Interest id.

### Activity Endpoints (Authenticated)

Creating a new activity is done by sending a POST request to /activity with the activity's data in JSON format

<code>POST /activity</code>

Example JSON using only the required fields:
``` javascript
{
  "interest": "89f2093kf0z9sdfhj",
  "startLocation": [50.524, 123.45],
}
```
Optionally, a description can be added as well. The currently authenticated user will be used as the activity's host.

<code>GET /activity/search</code>

Lets you search for nearby activities within a certain location and radius that can optionally match an interest.

Example request:
<code>/activity/search?lat=50.293&lng=120.55&dist=4&interest=f893js2hd28s9k9fk2</code>
where lat/lng are the lattitude and longitude, dist is the search radius in miles, and the interest is an optional field that represents an Interest id.
