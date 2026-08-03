
# day 

I chose to use references for venue_sports instead of strings. Since sports already have their own collection, storing their IDs connects the venue to the existing sport records. This also avoids having different spellings or duplicate names for the same sport.



I decided to keep getCustomers but protect it with authentication for now. Normal customers should not be able to see the list of all customers, so later this route should be restricted to admins when an admin role is added.

# E-O-D check

q1) If i took box_owner_id from the request body, an owner could put another owner's ID in the body and create a venue under their account using req.user.id is safer because it comes from the verified token, so the venue is automatically linked to the owner who is actually logged in.

q2) If a customer with a valid token tries POST /venues, requireAuth will pass because the token is valid, but requireRole("owner") will stop them because their role is customer, giving a 403 Forbidden if an owner tries to update another owner's venue, both requireAuth and requireRole("owner") pass. The ownership check in updateVenue stops them:

if (venue.box_owner_id.toString() !== req.user.id) {
    return res.status(403).json({
        message: "You are not allowed to update this venue."
    });
}
Both give 403, but for different reasons the customer has the wrong role, while the second person is an owner but doesn't own that specific venue.


q3)Being authenticated or having the correct role is not enough a user should only be allowed to access or modify a specific resource if that resource belongs to them.