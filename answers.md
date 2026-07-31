
# day 8

part 1:-

1.2) 
 in order to check tht, i generated a new token set to expire in 15 mins, used it to authorise and then changed the time to live to 15 seconds and reused the token but it was still valid, so i think no i cannot change the time to live of a taken that has been assigned already, and that the change in time to live only starts implementing from the next token generated

# part 2
If a user tells me that their account has been compromised and wants to be logged out from all devices immediately, my current system cannot do that instantly. This is because the access token is a JWT and it is not stored on the server. Once it is generated and given to the user, it stays valid until its expiry time. The only thing I can do immediately is delete the user's refresh token from the database. This means no new access tokens can be generated after the current one expires. Since my access token expires in 15 minutes, the attacker can still use the stolen token for up to 15 minutes. After that, they will be logged out because they won't have a valid refresh token to get a new access token

# E-O-D check

q1)  


q2)


q3)