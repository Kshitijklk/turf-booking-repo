
# day 6 

0.3)

I think keeping the 409 is okay because a disabled sport isn't actually deleted from the database,
so its name is still taken. If the idea is that disabled sports can be enabled again later, then 
reusing the same name could cause problems. My current code follows this behaviour. But if the 
project wants disabled sports to be treated like deleted ones, then the current code would need to 
be changed to allow that name to be used again.

# E-O-D check

q1)  
HMAC is used for email because the same email should always produce the same hash, so we can search 
for it during login. bcrypt is used for passwords because it is slow and adds a random salt, making
 passwords much harder to crack. If we used HMAC for passwords, they would be easier to attack. If 
 we used bcrypt for emails, every hash would be different, so we couldn't search users by email.


q2) No. Their password hashes will be different because bcrypt adds a random salt every time it 
creates a hash. This is what we want because an attacker cannot tell if two users have the same 
password.


q3) I don't think it's bad practice. The unique check belongs in the database because
 only the database can guarantee that no duplicates are created. If I use findOne() first, two 
 requests can still pass the check at the same time and create a race condition. By letting MongoDB
  handle the unique constraint and catching the 11000 error, the check and the write happen 
  together, making it safer and more reliable. So I'm not using exceptions as normal control 
  flow—I'm handling a database constraint that only the database can enforce.
  