library(readr)
getwd()
setwd("~/")
setwd("~/Users/jaydenfrancis/Downloads")
# reading collegedata from a csv file
collegedata <- read.csv("~/Downloads/college_variables.csv")

# omit all entries where SAT_AVG == "NULL"

nonullsat <- collegedata[!(collegedata$SAT_AVG=="NULL"),]

# when I converted the Google Sheets to a CSV file, it
# stored SAT_AVG as a character value, we must convert to numeric

satdata <- transform(nonullsat, SAT_AVG = as.numeric(SAT_AVG))

# Now that we are set up for the first part of this problem:
# lets divide up our data into regions
region1 <- subset(satdata, satdata$REGION == 1)
region2 <- subset(satdata, satdata$REGION == 2)
region3 <- subset(satdata, satdata$REGION == 3)
region4 <- subset(satdata, satdata$REGION == 4)
region5 <- subset(satdata, satdata$REGION == 5)
region6 <- subset(satdata, satdata$REGION == 6)
region7 <- subset(satdata, satdata$REGION == 7)
region8 <- subset(satdata, satdata$REGION == 8)
region9 <- subset(satdata, satdata$REGION == 9)

# Lets find the mean, median and standard deviation of each region

# region 1 descriptive statistics:
meanSATr1 <- mean(region1$SAT_AVG)
medianSATr1 <- median(region1$SAT_AVG)
sdSATr1 <- sd(region1$SAT_AVG)

# region 2 descriptive statistics:
meanSATr2 <- mean(region2$SAT_AVG)
medianSATr2 <- median(region2$SAT_AVG)
sdSATr2 <- sd(region2$SAT_AVG)

# region 3 descriptive statistics:
meanSATr3 <- mean(region3$SAT_AVG)
medianSATr3 <- median(region3$SAT_AVG)
sdSATr3 <- sd(region3$SAT_AVG)

# region 4 descriptive statistics:
meanSATr4 <- mean(region4$SAT_AVG)
medianSATr4 <- median(region4$SAT_AVG)
sdSATr4 <- sd(region4$SAT_AVG)

# region 5 descriptive statistics:
meanSATr5 <- mean(region5$SAT_AVG)
medianSATr5 <- median(region5$SAT_AVG)
sdSATr5 <- sd(region5$SAT_AVG)

# region 6 descriptive statistics:
meanSATr6 <- mean(region6$SAT_AVG)
medianSATr6 <- median(region6$SAT_AVG)
sdSATr6 <- sd(region6$SAT_AVG)

# region 7 descriptive statistics:
meanSATr7 <- mean(region7$SAT_AVG)
medianSATr7 <- median(region7$SAT_AVG)
sdSATr7 <- sd(region7$SAT_AVG)

# region 8 descriptive statistics:
meanSATr8 <- mean(region8$SAT_AVG)
medianSATr8 <- median(region8$SAT_AVG)
sdSATr8 <- sd(region8$SAT_AVG)

# region 9 descriptive statistics:
meanSATr9 <- mean(region9$SAT_AVG)
medianSATr9 <- median(region9$SAT_AVG)
sdSATr9 <- sd(region9$SAT_AVG)

# Now lets move on to admission rates
# first lets get rid of "NULL" and convert this character variable to numeric
nonulladmit <- collegedata[!(collegedata$ADM_RATE=="NULL"),]
admitdata <- transform(nonulladmit, ADM_RATE = as.numeric(ADM_RATE))

# now lets order this data

sortedadmitdata <- admitdata[order(admitdata$ADM_RATE, decreasing = TRUE), ]

# lets find a list of the least selective (all of which have an admit rate of 100% according to this data)
leastselective <- sortedadmitdata[1:10,]$INSTNM

# we know that this data set has 2006 so lets grab the last 10 to find 
# the most selective schools
mostselective <- sortedadmitdata[1997:2006,]$INSTNM

# we see Harvard at the top, followed by the Curtis Institute of Music

# now lets move on to the third section, and find which variables are most
# highly correlated with median income 10 years after graduating.
# firstly we must get rid of all NULL and PrivacySuppressed values.
nonullincome <- collegedata[!(collegedata$MD_EARN_WNE_P10=="NULL"),]
fullincome <- nonullincome[!(nonullincome$MD_EARN_WNE_P10 == "PrivacySuppressed"),]

# now lets transform this to numeric and we should had the complete dataset of incomes
incomedata <- transform(fullincome, MD_EARN_WNE_P10 = as.numeric(MD_EARN_WNE_P10))

# now we are ready to check correlation with other variables.

# First lets check correlation between income data and Unit ID
IDcorr <- cor(incomedata$MD_EARN_WNE_P10, incomedata$UNITID)

# As would be expected, the correlation coefficient here is very small, at 0.017

# lets check some more explanatory variables.

# it is possible that the region a college is in may have some correlation so lets test this
REGIONcorr <- cor(incomedata$MD_EARN_WNE_P10, incomedata$REGION)

# we find a small, negative correlation coefficient of -0.17

# Lets now check the admission rate.
incomedata <- incomedata[!(incomedata$ADM_RATE=="NULL"),]
incomedata <- transform(incomedata, ADM_RATE = as.numeric(ADM_RATE))
ADMITcorr <- cor(incomedata$MD_EARN_WNE_P10, incomedata$ADM_RATE)

# here we get the somewhat interesting result of a -.30 correlation coefficient
# suggesting a somewhat strong, negative correlation between income and admit rate

# Lets check correlation between avg sat.
incomedata <- incomedata[!(incomedata$SAT_AVG=="NULL"),]
incomedata <- transform(incomedata, SAT_AVG = as.numeric(SAT_AVG))
SATAVGcorr <- cor(incomedata$MD_EARN_WNE_P10, incomedata$SAT_AVG)

# We get out strongest correlation coefficient so far, at 0.6545

# (will come back to do more correlation stuff later)

# part 4, lets find the relationship between a school’s five year repayment rate 
# versus a school’s completion rate for first time full time students

# first lets get the data in the form that we need.
nonullrepayment <- collegedata[!(collegedata$COMPL_RPY_5YR_RT=="NULL"),]
nonullrepayment <- nonullrepayment[!(nonullrepayment$COMPL_RPY_5YR_RT=="PrivacySuppressed"),]
nonullrepayment <- nonullrepayment[!(nonullrepayment$C150_4=="NULL"),]
repaymentdata <- transform(nonullrepayment, COMPL_RPY_5YR_RT = as.numeric(COMPL_RPY_5YR_RT))
repaymentdata <- transform(repaymentdata, C150_4 = as.numeric(C150_4))

# now lets find the correlation coefficient.

repaycompletecorr <- cor(repaymentdata$COMPL_RPY_5YR_RT, repaymentdata$C150_4)

# we find a somewhat strong positive correlation of 0.5244

# lets move on to the final part of this project and analyze the distributions
# first lets visualize the distribution of AVG_SAT with a histogram

hist(satdata$SAT_AVG, main = "distribution of average SAT scores")

# from this histogram we can see that the distribution of average SAT score is
# approximately normal, and centered around 1100, it is also skewed to the right
# slightly

# Lets check out the distribution of admission rates
hist(admitdata$ADM_RATE, main = "distribution of admission rates")
# this distribution is skewed strongly to the left