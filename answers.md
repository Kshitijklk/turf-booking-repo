
# day 7

part 0:-

1) 
 Yes. If they try to register with rajiv@gmail.com and the API returns a duplicate email error,
 they know that the email is already registered. So even though the login endpoint hides this 
 information, the register endpoint accidentally reveals it.

2) 
keyPattern tells which field caused the duplicate error, like email_hash or phone_hash. keyValue
contains the value that caused the conflict. I don't think this information should be sent to user
because it exposes internal database details that normal users don't need to see.

3) 
I was mainly focused on making the login endpoint secure, so I made sure it didn't reveal whether 
an email existed. While writing the register endpoint, I relied on MongoDB's duplicate error
response and didn't think about the fact that it could also leak information. I wasn't looking at
both endpoints from the same security perspective.

# E-O-D check

q1)  



q2)


q3)