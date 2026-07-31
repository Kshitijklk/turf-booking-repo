
# day 8

part 1:-

1.2) 
 in order to check tht, i generated a new token set to expire in 15 mins, used it to authorise and then changed the time to live to 15 seconds and reused the token but it was still valid, so i think no i cannot change the time to live of a taken that has been assigned already, and that the change in time to live only starts implementing from the next token generated

# part 2
If a user tells me that their account has been compromised and wants to be logged out from all devices immediately, my current system cannot do that instantly. This is because the access token is a JWT and it is not stored on the server. Once it is generated and given to the user, it stays valid until its expiry time. The only thing I can do immediately is delete the user's refresh token from the database. This means no new access tokens can be generated after the current one expires. Since my access token expires in 15 minutes, the attacker can still use the stolen token for up to 15 minutes. After that, they will be logged out because they won't have a valid refresh token to get a new access token


# part 4
for  mobile based application, the local OS storage is seemingly the only good option  for token storage since both the concerned attacks are web based, the only threat of data theft is if the devie is stolen

for web based application, storing the token in an httpcookie since JavaScript cannot access an httpOnly cookie, it is safe for XSS attacks but vulnerable for crsf.

# part 5

I think JWT was the right choice for this Turf Booking app because it is fast and works well with mobile apps. Using short-lived access tokens and refresh tokens provides a good balance between performance and security

The downside is that stolen access tokens cannot be revoked immediately. For applications that require instant logout, server-side sessions would be a better choice

# E-O-D check

q1) If the access token is stolen, I cannot immediately stop it because the server does not store access tokens. It will keep working until it expires. I can revoke the refresh token so the attacker cannot get a new access token. If the access token lasts 15 minutes, then the attacker can only use it for those 15 minutes


q2) If a refresh token that was already deleted is used again, it probably means someone copied or stole that token. The server should treat this as suspicious, reject the request, and log the user out from all devices by deleting all their refresh tokens. The real user will also have to log in again


q3)If an access token is valid for 30 days and someone steals it, they can use the account for the whole 30 days. That is a big security risk. Short expiry times are safer because the stolen token becomes useless much sooner


q4) I would use server-side sessions when I need users to be logged out immediately. Since sessions are stored on the server, I can delete them anytime and instantly stop access. This is useful for applications like banking where security is very important