
## Part 0

When two requests arrive at the same time, both read the same value of `attempts` before either one updates it. Both think the value is `2`, both increase it to `3`, and both save `3'....even if the attacker made two wrong guesses, the database only records one additional attempt ,if 50 requests arrive at the same time, all of htem might overwrite each other's updates so the recorded number of attempts can be much lower than the actual number of guesses, this means the attempt limit can become inaccurate because multiple requests are updating the same document at the same time.

## part 6 q1)

I would keep pagination even if there are only 40 customers now but in a real world DB the number of customers can continue to grow making the the API with pagination from the beginning prevents future performance problems and avoids returning an unnecessarily large amount of data.
the question depends upon if the data will continue to grow, if that is the case, then pagination is a must to keep no matter if there are 4 customers or 4000....

## part 6 q2)

An encrypted phone number cannot be read but the hash, is used to identify and look up customers in the database. If an attacker gets the hash, they can hash phone numbers and compare them until they find a match
Once they find a matching hash, they know the original phone number and can also identify the same customer wherever that hash is used hence returning hashed phone number makes it prone to leak and vulnerabe to attack