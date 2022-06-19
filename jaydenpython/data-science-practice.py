# for practicing manipulation of data and common python functions


# The number of birds banded at a series of 
# sampling sites has been counted by your field crew and 
# entered into the following list. The first item in each
#  sublist is an alphanumeric code for the site and the second 
# value is the number of birds banded. Cut and paste the list i
# nto your assignment and then answer the following questions 
# by printing them to the screen.

data = [['A1', 28], ['A2', 32], ['A3', 1], ['A4', 0],
        ['A5', 10], ['A6', 22], ['A7', 30], ['A8', 19],
		['B1', 145], ['B2', 27], ['B3', 36], ['B4', 25],
		['B5', 9], ['B6', 38], ['B7', 21], ['B8', 12],
		['C1', 122], ['C2', 87], ['C3', 36], ['C4', 3],
		['D1', 0], ['D2', 5], ['D3', 55], ['D4', 62],
		['D5', 98], ['D6', 32]]

# how many sites are in this data set?

def getNumSites(Data):
    res = []
    count = 0
    for i in data:
        if i[0] not in res:
            res.append(i[0])
            count += 1
    return count

print("total number of sites: %d" % getNumSites(data))

# How many birds were counted at the 7th site?

print("there were %d birds counted in the 7th site" % data[6][1])

# What is the total number of birds counted across all sites?

def totalBirds(Data):
    count = 0
    for i in Data:
        count += i[1]
    return count

print("the total number of birds: %d" % totalBirds(data))


# What is the average number of birds seen on a site?

print("avg number of birds: %d" % (955/26))

# What is the total number of birds counted on sites with codes beginning with C?

def birdsCSites(Data):
    count = 0
    for i in Data:
        if 'C' in i[0]:
            count += i[1]
    return count

print("total birds in 'C' sites: %d" % birdsCSites(data))









        
